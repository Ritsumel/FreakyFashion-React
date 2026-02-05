type SearchBarProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
};

const SearchBar = ({ value, placeholder, onChange, onSubmit }: SearchBarProps) => {
  return (
    <div className="search-field">
      <i id="search-icon" className="fa-solid fa-magnifying-glass"></i>

      <input
        id="search-bar"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
