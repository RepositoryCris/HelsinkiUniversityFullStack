import axios from 'axios'

export const getAll = () => {
  return (
    axios
      .get('http://localhost:3001/persons')
  )
}

export const createPerson = (newPerson) => {
  return(
    axios
      .post('http://localhost:3001/persons', newPerson)

  )
}