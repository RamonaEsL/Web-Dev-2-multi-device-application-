function FilterBar({ search, setSearch, category, setCategory, categories }) {
  return (
    <div className="filter-bar">
      {/* Search expenses */}
      <label>
        Search
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses"/>
      </label>

      <label>
        Category
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FilterBar;
