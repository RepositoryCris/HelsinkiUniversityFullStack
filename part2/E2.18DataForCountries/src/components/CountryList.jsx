import CountryRow from "./CountryRow"; // adjust path if needed
import Country from "./Country";

const CountryList = ({
  filteredCountries,
  selectedCountry,
  setSelectedCountry,
}) => {
  if (filteredCountries.length > 10) {
    return <p>Make your query more specific</p>;
  }

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  }

  return (
    <>
      {filteredCountries.map((country) => (
        <CountryRow
          key={country.cca3}
          country={country}
          setSelectedCountry={setSelectedCountry}
        />
      ))}

      {selectedCountry && filteredCountries.includes(selectedCountry) && (
        <Country country={selectedCountry} />
      )}
    </>
  );
};

export default CountryList;
