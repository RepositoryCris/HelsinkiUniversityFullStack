import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import { fetchAll } from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchAll()
      .then((data) => {
        setCountries(data);
      })
      .catch((err) => {
        console.error("APP JSX - REST API Error fetching countries: ", err);
      });
  }, []);

  const handleFilterOnChange = ({ target }) => setFilter(target.value);

  {
    /* If the value of filter is ''(empty), it returns all the data. If the value of filter has content it will filter all that match*/
  }
  const country =
    filter === ""
      ? countries
      : countries.filter((item) =>
          item.name.common.toLowerCase().includes(filter.toLowerCase()),
        );

  return (
    <>
      <h1>Data for countries</h1>
      <Filter
        filter={filter}
        country={country}
        handleFilterOnChange={handleFilterOnChange}
      />
    </>
  );
};

export default App;
