import { useState } from 'react'

const ShowPerson = ({ name, number }) => <p>{ name } { number }</p>

const Content = ({ persons }) => (
  <>
    {persons.map(person => (
      <ShowPerson key={person.name} name={person.name} number = {person.number} />
    ))}
  </>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "040-12344567" }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const handleNameInput  = ({ target }) => setNewName(target.value)
  const handleNumberInput  = ({ target }) => setNewNumber(target.value)

  const addPerson = ( event ) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
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
      <h2>Phonebook</h2>
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
      <Content persons = { persons }/>
    </div>
  )
}

export default App