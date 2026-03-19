const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map((person) => (
      <Person key={person.id} person={person} handleDelete={handleDelete} />
    ))}
  </>
);

const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number} <span> </span>
      <button onClick={() => handleDelete(person.id)}>Delete</button>
    </p>
  );
};

export default Persons;
