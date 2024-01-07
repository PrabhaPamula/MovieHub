import React, { useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;
    const handleLogin = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:8001/login", {
            email : email,
            password: password,
        }).then((response) => {
            console.log(response);
            if(response.data.Status === "Success") {
                navigate('/');
                window.location.reload(true);
            } else {
                alert(response.data.Error);
            }

        })
    };

    return (
        <>
            <div className="SignuploginForm">
                <form onSubmit={handleLogin}>
                    <h4>Login</h4>
                    <input
                        className="textInput"
                        type="email"
                        name="email"
                        onChange={(e) => {setEmail(e.target.value);}}
                        placeholder="Enter your Email"
                        required
                    />
                    <input
                        className="textInput"
                        type="password"
                        name="password"
                        onChange={(e) => {setPassword(e.target.value);}}
                        placeholder="Enter your Password"
                        required
                    />
                    <button type="submit">Login</button>
                    <h3>Don't have an Account? <Link to='/signup' className='text-blue-600 font-medium'>Signup</Link></h3>
                </form>
            </div>
        </>
    );
};

