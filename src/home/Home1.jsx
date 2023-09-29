import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';

import Admin from "../Admin/Admin"

import Style from './Home.module.css'

function Home() {
    const [message, setMessage] = useState('')
    const [count, setCount] = useState(0)
    const [data, setData] = useState([])
    const [group, setGroups] = useState([])
    const [newGroupId, setNewGroupId] = useState()
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const groupId = localStorage.getItem('groupId')

    async function fetchMessages() {
        try {
            console.log(groupId);
            console.log("useeffect");
            const response = await axios.get(`http://localhost:3000/messages/${groupId}`);
            const newMessage = response.data.data;
            // setData(newMessage)
            localStorage.setItem("messages", JSON.stringify(newMessage))

            setCount(count + 1)
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }
    async function handleSend(e) {
        e.preventDefault()

        console.log(token);
        await axios.post(`http://localhost:3000/chat/${groupId}`, { message }, { headers: { "Authorization": token } })
        setMessage('')
        fetchMessages()
        console.log("done");
    }

    useEffect(() => {
        const message = JSON.parse(localStorage.getItem('messages')) || []
        setData(message)
    }, [count])

    useEffect(() => {
        async function fetchGroup() {
            const groups = await axios.get("http://localhost:3000/joinedGroups", { headers: { "Authorization": token } })
            console.log(groups.data.groups);
            setGroups(groups.data.groups)
            const groupId = JSON.parse(localStorage.getItem('groupId')) || []
            setSelectedId(groupId)
        }
        fetchGroup()
    }, [])

    // right part
    function handleCraeteGroup(e) {
        e.preventDefault()
        navigate("/GroupCreateForm")
    }
    async function handleGroupChange(e, id) {
        e.preventDefault()
        localStorage.setItem('groupId', JSON.stringify(id))
        const response = await axios.get(`http://localhost:3000/messages/${id}`);
        const newMessage = response.data.data;
        setData(newMessage)
        localStorage.setItem("messages", JSON.stringify(newMessage))
        setSelectedId(id);
    }

    return (
        <div className={Style.main}>
            <div className={Style.leftSection}>
                <h1>Chat App</h1>
                <div>{data.length == 0 ? <h3>No chats to show</h3> :
                    (
                        data.map((item, index) => (
                            <h4 key={index}>{item.message}</h4>
                        ))
                    )
                }

                </div>
                <div className={Style.typeBar}>
                    <input type="text" onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>

            <div className={Style.rightSection}>
                <h1>Groups</h1>
                <div className={Style.createGroupButton}>
                    <button onClick={handleCraeteGroup}>Create Group</button>
                </div>
                <div className={Style.groups}>
                    {group.map((i, id) => (
                        <div key={id}>
                            <button onClick={(e) => handleGroupChange(e, i.id)}
                                style={{
                                    backgroundColor: selectedId === i.id ? 'white' : 'initial',
                                    // color: selectedId === i.id ? 'white' : 'initial',
                                }}
                            >{i.name}</button>
                        </div>
                    ))}
                </div>
                <div className={Style.users}>
                    <Admin />
                </div>
            </div>
        </div>
    )
}

export default Home