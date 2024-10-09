export type Limits = {
  rpm: number; // Requests per minute
  tpm: number; // Tokens per minute
  monitoringInterval: number; // in seconds
};

export type Request = {
  tokenCount: number;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};