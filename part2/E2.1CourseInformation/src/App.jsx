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

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
      <h1>Web Development Curriculum</h1>
      {courses.map(course => <Course key = { course.id } course = { course }/>)}
    </>
  )
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
