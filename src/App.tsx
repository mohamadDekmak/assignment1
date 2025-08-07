import './App.css'
import TopSection from "./components/top-section"
import LeftSection from './components/left-section'
import { AppProvider } from './contexts/AppContext';
import { useEffect } from 'react';

function App() {
  return (
    <AppProvider>
      <TopSection/>
      <LeftSection/>
    </AppProvider>
  )
}

export default App
