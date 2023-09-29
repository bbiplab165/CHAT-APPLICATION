import { useState } from 'react'
import Style from './Registration.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Registration() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(name, email, password, phone);
        await axios.post('http://localhost:3000/createUser', { name, email, password, phone })
        navigate('/')
    }
    function handleLogin(){
        navigate('/')
    }

    return (
        <div className={Style.pageContainer}>
            <div className={Style.main}>
                <form>
                    <h3>Registration :</h3>
                    <div className={Style.container}>
                        <label>Name :</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={Style.container}>
                        <label>Email :</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={Style.container}>
                        <label>Phone Number :</label>
                        <input type="text" onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className={Style.container}>
                        <label>Password :</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type='submit' onClick={handleSubmit}>Submit</button>
                </form>
                <h4>Hava a account ? <span onClick={handleLogin}> Please Login</span></h4>
            </div>
        </div>
    )
}

export default Registration