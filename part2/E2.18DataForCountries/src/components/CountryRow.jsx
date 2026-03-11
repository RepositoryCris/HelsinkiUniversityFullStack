const CountryRow = ({ country, setSelectedCountry }) => {
  return (
    <p>
      {country.name.common}
      <button onClick={() => setSelectedCountry(country)}>Show</button>
    </p>
  );
};

export default CountryRow;
