import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ShowAllkinkun from './pages/ShowAllkinkun'
import Addkinkun from './pages/Addkinkun'
import Editkinkun from './pages/Editkinkun'

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/showallkinkun' element={<ShowAllkinkun />} />
      <Route path='/addkinkun' element={<Addkinkun />} />
      <Route path='/editkinkun/:id' element={<Editkinkun />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}
