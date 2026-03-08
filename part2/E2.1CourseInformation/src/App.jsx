const Header = ({ name }) => <h1>{ name }</h1>

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
  const sum = parts.reduce((total, part) => {

    console.log('Total so far:', total, 'Adding:', part.exercises)
    return total + part.exercises
  }, 0)
  
  console.log('Total',sum)
  return <p>Total of {sum} exercises</p>
}


const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course = { course } />
}

export default App

{/* Inspect, react components should look like this:
  App
    Course
      Header
      Content
        Part   key: 1
        Part   key: 2
        Part   key: 3 
  
  This code is like an experienced React developer*/
      }
