import { useState } from 'react'
import './App.css'
import TopSection from "./components/top-section"
import LeftSection from './components/left-section'

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
