import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const handleNameChange  = ({ target }) => setNewName(target.value)
  const handleNumberChange  = ({ target }) => setNewNumber(target.value)
  const handleFilterChange = ({ target }) => setFilter(target.value)

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const addPerson = ( event ) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
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

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
      <Persons persons = { personsToShow }/>
    </div>
  )
}

export default App