// the Search component receives a searchTerm and a setSearchTerm function as parameters
// it then sets the searchTerm to whatever the user types in the input field.
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="/search.svg" alt="search" />
        <input
          type="text"
          value={searchTerm}
          placeholder="Search through thousands of movies"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
