import { useState, useEffect, useCallback } from 'react';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import { fetchList } from './api/fetch-list';
import { ItemData } from './types/common';

import './App.css';

function App() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [query, setQuery] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [lastSelectedItemId, setLastSelectedItemId] = useState<number | null>(null);
  const [totalSelectedCount, setTotalSelectedCount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    const data = await fetchList({ query });
    setItems(data);
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData, query]);


  useEffect(() => {
    setTotalSelectedCount(selectedItemIds.length);
  }, [selectedItemIds]);

  const onSelectItem = (id: number) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedItemIds((ids) => [...ids, id]);
      setLastSelectedItemId(selectedItemIds.length ? selectedItemIds[selectedItemIds.length - 1] : null);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Item List</h1>
      <p>Total Items Selected: {totalSelectedCount}</p>
      <p>Last selected item ID is: {lastSelectedItemId}</p>
      <SearchBar query={query} setQuery={setQuery} />
      <ItemList
        query={query}
        items={items}
        selectedItemIds={selectedItemIds}
        onSelectItem={onSelectItem}
      />
    </div>
  );
}

const styles: { container: React.CSSProperties} = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 500,
  }
}

export default App;
