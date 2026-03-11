import CountryWeather from "./CountryWeather";

const Country = ({ country }) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>Capital: {country?.capital?.[0] || "No capital"}</p>
      <p>Area: {country?.area} km²</p>
      <h3>Languages</h3>

      {country.languages ? (
        <ul>
          {Object.values(country.languages).map((language) => (
            <ListItem key={`${country.cca3}-${language}`} language={language} />
          ))}
        </ul>
      ) : (
        <p>No language data available</p>
      )}

      <div
        style={{
          backgroundColor: "lightgray",
          margin: "10px",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      </div>
      <CountryWeather country={country} />
    </>
  );
};

const ListItem = ({ language }) => <li>{language}</li>;

export default Country;
