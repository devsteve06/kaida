import { Link } from "react-router-dom"
import { useAuth } from "../context/Auth_Context";

function Navbar() {

  const {user} = useAuth(); //

  return (
    <nav >
      <Link to='/' className="text-xl font-bold" >kaida</Link>
    </nav>
  )
}

export default Navbar;