const Country = ({ country }) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>Capital: {country?.capital?.[0] || "No capital"}</p>
      <p>Area: {country?.area} km²</p>
      <h3>Languages</h3>

      {country.languages ? (
        <>
          <ul>
            {Object.values(country.languages).map((language) => (
              <ListItem
                /*cca3 is the unique 3-letter country code standardized by the ISO 3166-1 alpha-3 standard.*/
                key={`${country.cca3}-${language}`}
                language={language}
              />
            ))}
          </ul>
        </>
      ) : (
        <p>No language data available</p>
      )}
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
    </>
  );
};

const ListItem = ({ language }) => {
  return <li>{language}</li>;
};
export default Country;
