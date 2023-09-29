import { useState } from 'react'
import Style from './Login.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            console.log(email, password);
            const response = await axios.post('http://localhost:3000/login', { email, password });
            const token = response.data.token;
            console.log(token);
            console.log(response);
            localStorage.setItem('token', token);
            const user = {
                userName: response.data.userName,
                userId: response.data.userId,
            };
            localStorage.setItem("user", JSON.stringify(user))
            navigate('/SelectGroup');
        } catch (error) {
            console.error('Login error:', error);
        }
    }
    function handleSignUp() {
        // navigate("/Registration")
    }
    return (
        <div className={Style.main}>
            <div className={Style.login}>
                <h2>Login</h2>
                <div className={Style.Container}>
                    <label>Email:</label>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={Style.Container}>
                    <label>Password:</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleSubmit}>Login</button>
                <h4>Don't have an account ?<span onClick={handleSignUp}>Sighn up</span></h4>
            </div>
        </div>
    )
}

export default Login