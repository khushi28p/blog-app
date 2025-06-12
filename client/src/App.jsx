import { Button } from "./components/ui/button"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

function App() {

  return (
    <>
    <Toaster richColors position="top-center" expand={true} />
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      </Routes>
    </>
  )
}

export default App
