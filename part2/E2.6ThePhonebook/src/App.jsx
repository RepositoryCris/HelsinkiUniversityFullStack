import { useState } from 'react'

const ShowPerson = ({ name }) => <p>{ name }</p>

const Content = ({ persons }) => (
  <>
    {persons.map(person => (
      <ShowPerson key={person.name} name={person.name} />
    ))}
  </>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')
  
  const handleNameInput  = ({ target }) => setNewName(target.value)

  const addPerson = ( event ) => {
    event.preventDefault()
    const personObject = {
      name: newName
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange = { handleNameInput  } value = { newName }/>
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