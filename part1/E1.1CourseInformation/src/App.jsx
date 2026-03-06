const Header = (props)=>{
  return (
    <h1>{props.name}</h1>
  )
}

const Content = (props)=>{
  return (
    <div>
      <p> {props.part1} {props.exercises1} </p>
      <p> {props.part2} {props.exercises2} </p>
      <p> {props.part3} {props.exercises3} </p>
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header name = { course }/>
      <Content
        part1 = { part1.name }
        part2 = { part2.name }
        part3 = { part3.name }
        exercises1 = { part1.exercises }
        exercises2 = { part2.exercises }
        exercises3 = { part3.exercises }/>
    </div>
  )
}

export default App