const Header = ({ name }) => <h2>{ name }</h2>

const Content = ({ parts }) => (
  <>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </>
)

const Part = ({ part }) => (
      <p>{part.name} {part.exercises}</p>
  )

const Course = ({ course }) => {
  return(
    <>
      <Header name = { course.name }/>
      <Content parts = { course.parts } />
      <Total parts = { course.parts }/>
    </>
  )
}

const Total = ({ parts }) => {
  const sum = parts.reduce((total, part) => total + part.exercises, 0)
  return <p>Total of {sum} exercises</p>
}

export default Course