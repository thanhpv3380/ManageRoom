import React, { useState } from 'react';
import axios from 'axios';

// constants
import * as types from './../../constants/ActionTypes';
//css
import './Login.css';
import { useHistory } from 'react-router-dom';

function Login() {
    let history = useHistory();
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const handleChange = (e) => {
        setErrors('');
        setPassword(e.target.value);
    }
    const handleClick = async (e) => {
        e.preventDefault();
        if (password) {
            //console.log('test');
            try {
                const response = await axios.post(`${types.URL}/login`, { password });
                //console.log(response.data.success);
                if (!response.data.success){
                    setErrors('Password does not match');
                } else {
                    localStorage.setItem('user', response.data.token);
                    history.push('/home');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    if (localStorage.getItem('user')){
        history.push('/home');
    }
    return (
        <div className="login-page">
            <div className="form">
                { errors ? 
                    <div className="alert alert-danger">
                        {errors}
                    </div>
                    :
                    ''
                }
                <form className="login-form">
                    <input
                        type="password"
                        placeholder="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                    <button onClick={handleClick}>login</button>
                </form>
            </div>
        </div>
    )
}
export default Login;