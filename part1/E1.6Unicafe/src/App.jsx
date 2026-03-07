import { useState } from 'react'

const Header = ()=>{
  return (<h1>Give feedback</h1>)
}

const Button = ({ name , onClick})=>{
  return (
    <button onClick={onClick}>{ name }</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
        <tr>
          <td>{ text }</td>
          <td>{ value }</td>
        </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = total === 0 ? 0 : ((good - bad)/total)
  const positive = total === 0 ? 0 : (good/total)*100

  // If no feedback, show message
  if (total === 0) {
    return (
      <>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </>
    )
  }

  // Otherwise show statistics
  return (
    <>
      <h2>Statistics</h2>
      <table>
        <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average.toFixed(2)} />
        <StatisticLine text="positive" value={positive.toFixed(2) + "%"} />
        </tbody>
      </table>
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