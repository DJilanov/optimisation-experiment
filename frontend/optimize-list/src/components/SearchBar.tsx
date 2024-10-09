import { SearchBarProps } from "../types/common";

function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      style={styles.input}
    />
  );
}

const styles = {
  input: {
    width: '100%',
  }
}

export default SearchBar;