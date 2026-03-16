import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

export const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

export const createPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((res) => res.data);
};

export const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export const updatePerson = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson).then((res) => res.data);
};
