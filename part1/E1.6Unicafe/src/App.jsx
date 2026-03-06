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
  const total = parseInt(good + neutral + bad)
  const average = total === 0 ? 0 : parseFloat((good*(1) + neutral*(0) + bad*(-1))/total)
  const positive = total === 0 ? 0 : parseFloat((good/total)*100)

  return (
    <>
      <h2>Statistics</h2>
      <p>Good { good }</p>
      <p>Neutral { neutral }</p>
      <p>Bad { bad }</p>
      <p>All { total }</p>
      <p>Average { average.toFixed(2) }</p>
      <p>Positive { positive.toFixed(2) }%</p>
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