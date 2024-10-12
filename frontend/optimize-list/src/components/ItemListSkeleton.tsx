import { useEffect, useRef, useState } from 'react';
import { ItemListProps } from '../types/common';
import Item from './Item';

function ItemList({ items, selectedItemIds, onSelectItem }: ItemListProps) {
  // State to track visibility of items
  const [visibleItems, setVisibleItems] = useState<number[]>([]); // Store ids of visible items
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]); // References for each item

  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1, // Trigger when at least 10% of the element is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const itemId = Number(entry.target.getAttribute('data-id')); // Assuming each item has a data-id attribute
        if (entry.isIntersecting) {
          setVisibleItems(prev => [...new Set([...prev, itemId])]); // Add itemId to visible items
        } else {
          setVisibleItems(prev => prev.filter(id => id !== itemId)); // Remove itemId from visible items
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each item
    itemRefs.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    // Cleanup function to unobserve when the component unmounts
    return () => {
      itemRefs.current.forEach((item) => {
        if (item) {
          observer.unobserve(item);
        }
      });
    };
  }, [items]); // Rerun effect when items change

  return (
    <ul style={styles.ul}>
      {items.map((item) => (
        <li
          style={{backgroundColor: selectedItemIds.includes(item.id) ? 'yellow' : 'white'}}
          key={item.id}
          ref={(el) => (itemRefs.current[item.id] = el)} // Assign ref for each item
          data-id={item.id} // Use data attribute to identify item
        >
          {
            visibleItems.includes(item.id) ? (
              <Item
                item={item}
                onClick={() => onSelectItem(item.id)}
              />
            ) : null
          }
        </li>
      ))}
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
