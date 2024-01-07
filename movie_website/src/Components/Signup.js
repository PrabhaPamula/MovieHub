import React, { useState } from 'react'
import './Form.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const register = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:8001/signup", {
            username : username,
            email : email,
            password: password,
        }).then((response) => {
            console.log(response);
            if(response.data.Status === "Success") {
                navigate('/login');
            } else {
                alert(response.data.Error);
            }

        }).then(err => console.log(err));
    };

  return (
    <>
    <div className='SignuploginForm'>
        <form onSubmit={register}>
            <h4>Signup</h4>
            <input type='text' placeholder='Enter username' name='username' onChange={(e) => {setUsername(e.target.value);}}/>
            <input type='email' placeholder='Enter email' name='email' onChange={(e) => {setEmail(e.target.value);}}/>
            <input type='password' placeholder='Enter password' name='password' onChange={(e) => {setPassword(e.target.value);}}/>
            <button type='submit'>Register</button>
            <h3>Already have an Account? <Link to='/login' className='text-blue-600 font-medium'>Login</Link></h3>
        </form>
    </div>
    </>
  )
}

