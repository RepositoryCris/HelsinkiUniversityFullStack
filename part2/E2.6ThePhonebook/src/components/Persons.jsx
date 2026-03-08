const Persons = ({ persons }) => (
  <>
    {persons.map(person => (
      <Person
      key = {person.id}
      name = {person.name}
      number = {person.number} />
    ))}
  </>
)

const Person = ({ name, number }) => <p>{ name } { number }</p>

export default Persons