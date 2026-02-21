import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
   <>
   <Navbar/>
   <main flex className='min-h-screen items-center justify-center bg-gray-100'>
      <Outlet/>
   </main>
   <Footer/>
   </>
  )
}

export default MainLayout;