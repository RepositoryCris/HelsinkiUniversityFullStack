import Country from "./Country";

const Filter = ({ filter, country, handleFilterOnChange }) => {
  const renderContent = () => {
    if (filter === "") {
      return null;
    }

    if (country.length > 10) {
      return <p>Make your query more specific ({country.length} results)</p>;
    }

    if (country.length === 0) {
      return <p>No countries found matching "{filter}"</p>;
    }

    if (country.length === 1) {
      // Show detailed view for single country
      return <Country key={country[0].cca3} country={country[0]} />;
    }

    // Show list for 2-10 results
    return country.map((country) => (
      <SectionOfTen key={country.cca3} country={country} />
    ));
  };

  return (
    <>
      <p>
        Find countries:
        <input
          id={"filter-input"}
          value={filter}
          onChange={handleFilterOnChange}
        />
      </p>
      {renderContent()}
    </>
  );
};

const SectionOfTen = ({ country }) => {
  return <p>{country.name.common}</p>;
};

export default Filter;
