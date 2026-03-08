const Filter = ({ handleFilterChange , filter }) => {
  return(
    <div>
        Filter shown with:
        <input
        onChange = { handleFilterChange }
        value = { filter }/>
      </div>
  )
}

export default Filter