const CountrySearch = ({ filter, handleFilterOnChange }) => {
  return (
    <p>
      Find countries:
      <input id="filter-input" value={filter} onChange={handleFilterOnChange} />
    </p>
  );
};

export default CountrySearch;
