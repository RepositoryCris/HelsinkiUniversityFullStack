import axios from "axios";

export const fetchAll = async () => {
  try {
    const response = await axios.get(
      "https://studies.cs.helsinki.fi/restcountries/api/all",
    );
    return response.data; // ✅ This is ALREADY an array of countries
  } catch (error) {
    console.error("AXIOS - REST API Error fetching countries: ", error);
  }
};
