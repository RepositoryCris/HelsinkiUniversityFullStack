import { useState } from 'react'

const Header = ()=>{
  return (<h1>Give feedback</h1>)
}

const Button = ({ name , onClick})=>{
  return (
  <>
    <button onClick={onClick}>{ name }</button>
  </>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  return (
    <>
      <h2>Statistics</h2>
      <p>Good {good}</p>
      <p>Neutral {neutral}</p>
      <p>Bad {bad}</p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header />
      <Button name = "good" onClick = { () => setGood(good+1) }/>
      <Button name = "neutral" onClick = { () => setNeutral(neutral+1) }/>
      <Button name = "bad" onClick = { () => setBad(bad+1) }/>
      <Statistics good = { good }
                  neutral ={ neutral }
                  bad = { bad } />
    </div>
  )
}

export default App