import { Button } from "./components/ui/button"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Editor from "./pages/Editor"
import PublishPage from "./pages/PublishPage"
import React from "react"
import { Routes, Route } from "react-router-dom"
import BlogPage from "./pages/BlogPage"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/editor" element={<Editor/>} />
      <Route path="/publish" element={<PublishPage /> } />
      <Route path="/blog/:blogId" element={<BlogPage />} /> 
      <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </>
  )
}

export default App
