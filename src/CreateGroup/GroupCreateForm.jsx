import axios from "axios"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import Style from "./GroupForm.module.css"

function GroupForm() {
    const [name,setName]=useState('')
    const Navigate=useNavigate()

    function createGroup(e){
        e.preventDefault()
        const token =localStorage.getItem("token")
        console.log(token);
        // localStorage.setItem('groupId',JSON.stringify(groupId))
        axios.post("http://localhost:3000/createGroup",{name}, { headers: { "Authorization": token } })
        Navigate("/HOME")
    }
    return (
        <div className={Style.main}>
            <div className={Style.cointainer}>
                <label>Group Name : </label>
                <input type="text" onChange={(e)=>setName(e.target.value)}></input>
                <button onClick={createGroup}>Create Group</button>
            </div>
        </div>
    )
}

export default GroupForm