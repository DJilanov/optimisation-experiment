export type SearchBarProps = {
  query: string;
  setQuery: (query: string) => void;
};

export type ItemListProps = {
  query: string;
  items: ItemData[];
  selectedItemIds: number[];
  onSelectItem: (id: number) => void;
};

export type ItemData = {
    id: number;
    name: string;
};

export type ItemProps = {
    item: ItemData;
    onClick: () => void;
};