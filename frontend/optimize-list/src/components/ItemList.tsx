import { useEffect, useRef, useState } from 'react';
import { ItemListProps } from '../types/common';
import Item from './Item';

const elementsPerPage = 50;

function ItemList({ items, selectedItemIds, query, onSelectItem }: ItemListProps) {
  const bottomRef = useRef<(HTMLDivElement | null)>(null);
  const [visibleItems, setVisibleItems] = useState<{ id: number, name: string }[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if(page > 0) {
      setVisibleItems((prev) => [...prev, ...items.slice(page * elementsPerPage, (elementsPerPage + page * elementsPerPage))]);
    }
  }, [items, page]);

  useEffect(() => {
    setPage(0);
    setVisibleItems(items.slice(0, 50));
  }, [items, query]);

  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1, // Trigger when at least 10% of the element is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(bottomRef?.current as Element);

    // Cleanup function to unobserve when the component unmounts
    return () => {
      observer.unobserve(bottomRef?.current as Element);
    };
  }, []);

  return (
    <ul style={styles.ul}>
      {visibleItems.map((item) => (
        <li
          style={{ backgroundColor: selectedItemIds.includes(item.id) ? 'yellow' : 'white' }}
          key={`item-${item.id}`}
        >
          <Item
            item={item}
            onClick={() => onSelectItem(item.id)}
          />
        </li>
      ))}
      <div ref={bottomRef}>Loading more items...</div>
    </ul>
  );
}

const styles = {
  ul: {
    width: '100%',
    listStyle: 'none',
    paddingLeft: 0,
  }
}

export default ItemList;
