import { useState } from 'react';
import './SearchBar.scss';

type Props = {
  onSearch: (query: string, mode: 'title' | 'actor') => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'title' | 'actor'>('title');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'title' ? 'actor' : 'title';
    setMode(newMode);
    onSearch(query, newMode);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={`Search by ${mode}...`}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />
      <button onClick={toggleMode} className="mode-toggle">
  🔁 Search {mode === 'title' ? 'By Actor' : 'By Title'}
</button>

    </div>
  );
};

export default SearchBar;
