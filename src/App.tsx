import { useState } from 'react'
import './App.css'
import TopSection from "./components/TopSection"
import LeftSection from './components/LeftSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TopSection/>
      <LeftSection/>
    </>
  )
}

export default App
