import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./Select.module.css"

function SelectGroup() {
    const [groups, setGroups] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        async function fetchGroups() {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get("http://localhost:3000/joinedGroups", { headers: { "Authorization": token } });
                console.log(response);
                setGroups(response.data.groups);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        }
        fetchGroups();
    }, []);
    async function handleGroup(groupId){
        localStorage.setItem('groupId',JSON.stringify(groupId))
        const response = await axios.get(`http://localhost:3000/messages/${groupId}`);
        // console.log(data);
        const newMessage = response.data.data;
        console.log(newMessage);
        localStorage.setItem("messages", JSON.stringify(newMessage))
        navigate('/Home')
    }
    function handleCreate(){
        navigate('/GroupCreateForm')
    }

    return (
        <div className={Style.main}>
            <div className={Style.cointainer}>
                <h1>Please Select A Group</h1>
                {groups.length === 0 ? (
                    <div>
                        <h3>You have not joined any group yet. Please create a group </h3>
                        <button onClick={handleCreate} className={Style.createGroup}>Create Group</button>
                    </div>
                ) : (
                    <div>
                        {groups.map((group) => (
                            <div key={group.id}>
                                <button onClick={()=>handleGroup(group.id)} className={Style.groups}>{group.name}</button>
                            </div>
                        ))}
                        <button onClick={handleCreate} className={Style.createGroup}>Create Group</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectGroup;
