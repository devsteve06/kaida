import { Routes,Route } from "react-router-dom"
import MainLayout  from './layouts/MainLayout'
import Home from './pages/public/Home'
import NotFound from "./pages/public/NotFound"
import Profile  from "./pages/public/Profile"

function App() {
  return (
   <Routes>
        <Route path="/"  element={<MainLayout/>}>
            <Route element={<Profile/>}>Profile</Route>
            <Route element = {<Home/>}>Home</Route>
        </Route>
    <Route path="*" index   element={<NotFound/>}/>
   </Routes>

   
  )
}

export default App
