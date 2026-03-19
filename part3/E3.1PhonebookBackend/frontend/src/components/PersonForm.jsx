const PersonForm = ({
  addPerson,
  handleNameChange,
  newName,
  handleNumberChange,
  newNumber,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number:{" "}
        <input
          onChange={handleNumberChange}
          value={newNumber}
          placeholder="12-3... or 123-4..."
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
