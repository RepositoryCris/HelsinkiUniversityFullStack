import { useState , useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { getAll , createPerson , deletePerson } from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  useEffect(() => {
      getAll().then(response => setPersons(response.data))
    }, [])

  const handleNameChange  = ({ target }) => setNewName(target.value)
  const handleNumberChange  = ({ target }) => setNewNumber(target.value)
  const handleFilterChange = ({ target }) => setFilter(target.value)

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
  
  const handleDelete = ( id ) => {
      const person = persons.find(p => p.id === id)
    
      if (window.confirm(`Delete ${person.name}?`)) {
        deletePerson(id)
          .then(() => {
            // Remove the deleted person from state
            setPersons(persons.filter(p => p.id !== id))
          })
          .catch(error => {
            console.error('Error deleting person:', error)
            alert('Failed to delete person from server')
          })
        }
      }

  const addPerson = ( event ) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }
    
    const nameExists = persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())

    if (newName.trim() === '' || newNumber.trim() === '') {
      alert('Name and number cannot be empty')
      setNewName('')
      setNewNumber('')
      return
    }

    if ( nameExists ){
      alert(`${ newName } is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }
    
    createPerson(personObject).then(
      response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
      }
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        handleFilterChange = { handleFilterChange }
        filter = { filter } />
      <h3>Add a new</h3>
      <PersonForm
        addPerson = { addPerson }
        handleNameChange = { handleNameChange }
        newName = { newName }
        handleNumberChange = { handleNumberChange }
        newNumber = { newNumber } />
      <h3>Numbers</h3>
      <Persons
        persons = { personsToShow }
        handleDelete = { handleDelete } />
    </div>
  )
}

export default App