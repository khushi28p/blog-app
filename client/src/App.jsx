import { Button } from "./components/ui/button"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      </Routes>
    </>
  )
}

export default App
