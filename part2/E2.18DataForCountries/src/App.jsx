import { useState, useEffect } from "react";
import { fetchAll } from "./services/countries";

import CountrySearch from "./components/CountrySearch";
import CountryList from "./components/CountryList";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filteredCountries =
    filter === ""
      ? countries
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(filter.toLowerCase()),
        );

  useEffect(() => {
    fetchAll()
      .then((data) => {
        setCountries(data);
      })
      .catch((err) => {
        console.error("APP JSX - REST API Error fetching countries: ", err);
      });
  }, []);

  const handleFilterOnChange = ({ target }) => {
    setFilter(target.value);
    setSelectedCountry(null);
  };

  return (
    <>
      <h1>Data for countries</h1>
      <CountrySearch
        filter={filter}
        handleFilterOnChange={handleFilterOnChange}
      />

      <CountryList
        filteredCountries={filteredCountries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  );
};

export default App;
