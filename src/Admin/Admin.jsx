import axios from "axios"
import { useEffect, useState } from "react"

import Style from "./Admin.module.css"
import img from "../assets/users.png"

function Admin() {
    const [users, setUsers] = useState([])
    const [clicked, setClicked] = useState(false)
    const [phone, setPhone] = useState()
    const [reloadComponent, setReloadComponent] = useState(0);

    const groupId = localStorage.getItem("groupId")
    const token = localStorage.getItem("token")

    useEffect(() => {
        async function data() {
            const data = await axios.get(`http://localhost:3000/members/${groupId}`)
            console.log(data.data.data);
            setUsers(data.data.data)
        }
        data()
    }, [groupId, reloadComponent])

    async function handleAddParticipant(e) {
        setClicked(true)
    }
    function handleCancel() {
        setClicked(false)
    }
    async function handleParticipantAdded() {
        console.log(token);
        const response = await axios.post("http://localhost:3000/addParticipant", {
            phone: phone,
            groupId: groupId
        }, { headers: { "Authorization": token } })
        console.log(response);
        setClicked(false)
        setReloadComponent(reloadComponent + 1)
    }
    async function handleUserDelete(id) {
        try {
            console.log(groupId);
            await axios.post("http://localhost:3000/removeParticipant", { groupId, userId: id }, { headers: { "Authorization": token } })
            setReloadComponent(reloadComponent + 1)
        }
        catch (err) {
            console.error("Error data:", err.response.data.message);
            alert(err.response.data.message)
        }
    }

    async function handleAdmin(id) {
        try {
            const response = await axios.post("http://localhost:3000/makeAdmin", { groupId, userId: id }, { headers: { "Authorization": token } });
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                console.error("Error data:", error.response.data.message);
                alert(error.response.data.message)
            } else {
                console.error("Error:", error.message);
            }
        }

    }
    return (
        <div className={Style.main}>
            <div className={Style.cointainer}>
                <div className={Style.image}>
                    <img src={img} alt="Participants" />
                    <h1>Participants</h1>
                </div>
                <div className={Style.members}>
                    {users.map((i) => (
                        <div key={i.id} className={Style.eachUser}>
                            <h4>{i.username}</h4>
                            <span onClick={(e) => handleUserDelete(i.id)}>❌</span>
                            <span onClick={(e) => handleAdmin(i.id)}>{i.isAdmin ? (<h6>Admin</h6>) : ("🛠️")}</span>
                        </div>
                    ))}
                </div>
                <div className={Style.participant}>
                    {clicked ? (
                        <div className={Style.addParticipant}>
                            <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
                            <button onClick={handleParticipantAdded} className={Style.addButton}> Add</button>
                            <button onClick={handleCancel} className={Style.cancelButton}>Cancel</button>
                        </div>
                    ) : <button onClick={handleAddParticipant} className={Style.cancelButton}>Add Participant</button>}
                </div>

            </div>
        </div>
    )
}

export default Admin