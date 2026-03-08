import { useState } from 'react'

const ShowPerson = ({ name, number }) => <p>{ name } { number }</p>

const Content = ({ persons }) => (
  <>
    {persons.map(person => (
      <ShowPerson key = {person.id}
                  name = {person.name}
                  number = {person.number} />
    ))}
  </>
)

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
  
  const handleNameInput  = ({ target }) => setNewName(target.value)
  const handleNumberInput  = ({ target }) => setNewNumber(target.value)
  const handleFilterInput = ({ target }) => setFilter(target.value)

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
      id: persons.length + 1
    }
    
    const nameExists = persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())

    if (newName.trim() === '' || newNumber.trim() === '') {
      alert('Name and number cannot be empty')
      return
    }

    if (nameExists){
      alert(`${(newName)} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        Filter shown with:
        <input onChange = { handleFilterInput } value = { filter }/>
      </div>

      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange = { handleNameInput } value = { newName }/>
        </div>
        <div>
          number: <input onChange = { handleNumberInput } value = { newNumber }/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Content persons = { personsToShow }/>
    </div>
  )
}

export default App