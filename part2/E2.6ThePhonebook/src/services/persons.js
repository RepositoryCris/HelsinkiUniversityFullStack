import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

export const getAll = () => {
  return axios.get(baseUrl)
}

export const createPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson)
}

// Add this delete function (can't use 'delete' as name)
export const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}