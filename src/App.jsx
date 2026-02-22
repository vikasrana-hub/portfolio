import React from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'

import Landing from './page/landing'
import Layout from './layout/layout'


function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' element={<Landing/>}/>
      </Route>
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App