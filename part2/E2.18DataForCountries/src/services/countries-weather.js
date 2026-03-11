import axios from "axios";

export const fetchWeather = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data; // ✅ This is ALREADY an OBJECT of weather
  } catch (error) {
    console.error("AXIOS - REST API WEATHER Error fetching: ", error);
  }
};
