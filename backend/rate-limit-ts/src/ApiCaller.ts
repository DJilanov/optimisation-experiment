import { MockAPI } from "./MockAPI";
import { Limits, Request } from "./types";

export class ApiCaller {
  private apiInstances: MockAPI[];
  private limits: Limits;
  private requestQueue: Request[] = [];
  private activeRequests: number = 0;
  private tokensUsed: number = 0;
  private intervalTimer: NodeJS.Timeout | null = null;

  private async processQueue() {
    // While there are requests in the queue and we haven't hit our limits, process them
    while (
      this.requestQueue.length > 0 &&
      this.activeRequests < this.limits.rpm / 12 &&
      this.tokensUsed + this.requestQueue[0].tokenCount <= this.limits.tpm / 12
    ) {
      const request = this.requestQueue.shift()!;
      this.sendRequest(request);
    }
  }

  private async sendRequest(request: Request) {
    // Rotate between API instances for load balancing
    const apiInstance = this.apiInstances.shift()!;
    this.apiInstances.push(apiInstance);

    this.activeRequests++;
    this.tokensUsed += request.tokenCount;

    try {
      // Try calling the API
      const response = await apiInstance.callAPI(request.tokenCount);
      request.resolve(response);
    } catch (_e: unknown) {
      let error= _e as Error;
      // If we hit a rate limit, retry after the specified delay
      if (error.message.includes("429")) {
        const retryAfter = parseInt(
          error.message.match(/Retry After (\d+)/)?.[1] || "1"
        );
        console.log(`Retrying in ${retryAfter} seconds...`);
        setTimeout(() => {
          this.requestQueue.push(request);
        }, retryAfter * 1000);
      } else {
        request.reject(error);
      }
    } finally {
      this.activeRequests--;
       // Continue processing after each request
      this.processQueue();
    }
  }

  private startInterval() {
    const intervalMs = this.limits.monitoringInterval * 1000;

    // Every 5 seconds, reset the counters and process requests
    this.intervalTimer = setInterval(() => {
      this.activeRequests = 0;
      this.tokensUsed = 0;
      this.processQueue();
    }, intervalMs);
  }

  public stop() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  constructor(apiInstances: MockAPI[], limits: Limits) {
    this.apiInstances = apiInstances;
    this.limits = limits;
    this.startInterval();
  }

  async call(tokenCount: number) {
    // Wrap each request in a promise so we can handle async responses
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ tokenCount, resolve, reject });
      this.processQueue();
    });
  }
}
