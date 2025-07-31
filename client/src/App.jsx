import { Button } from "./components/ui/button"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Editor from "./pages/Editor"
import PublishPage from "./pages/PublishPage"
import React from "react"
import ProfilePage from "./pages/ProfilePage"
import { Routes, Route, Navigate } from "react-router-dom"
import BlogPage from "./pages/BlogPage"
import EditProfileModal from "./components/EditProfileForm"

import { useSelector } from "react-redux"

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <>
    <Routes>
      <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <HomePage />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/editor" element={<Editor/>} />
      <Route path="/publish" element={<PublishPage /> } />
      <Route path="/blog/:blogId" element={<BlogPage />} /> 
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-profile" element={<EditProfileModal />} />
      <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </>
  )
}

export default App
