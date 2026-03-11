import { useState, useEffect } from "react";
import { fetchWeather } from "../services/countries-weather";

const CountryWeather = ({ country }) => {
  const capital = country?.capital?.[0];
  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!capital) return;

    fetchWeather(url)
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => {
        console.error(
          "CountryWeather JSX - REST API Weather Error fetching countries: ",
          err,
        );
      });
  }, [url, capital]);

  if (!weather) return <p>Loading weather...</p>;

  const iconUrl = `https://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}@2x.png`;

  return (
    <>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather?.main?.temp} °C</p>
      <img
        src={iconUrl}
        alt={`icon of ${weather?.weather?.[0]?.description}`}
      />
      <p>{weather?.weather?.[0]?.description.toUpperCase()}</p>
      <p>Wind: {weather?.wind?.speed} m/s</p>
    </>
  );
};

export default CountryWeather;
