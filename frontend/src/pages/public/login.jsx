import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import React from 'react'

function login() {

    const {login} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({email:" ", password:""});

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name] : e.target.value});
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("");


            try {
                await login(form);
                navigate("/");
            } catch (error) {
                setError("Invalid Credentials")
            }
    }

    

  return (
    <div >
        <h2>Login</h2>
        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
             <input type="password" name="password" placeholder="Password" onChange={handleChange} />
             <button type="button">Login</button>
        </form>
    </div>
  )
}

export default login;