import axios from "axios"
import io from 'socket.io-client';
import { useEffect, useState, useRef } from "react"
import { useNavigate } from 'react-router-dom';

import Admin from "../Admin/Admin"

import Style from './Home.module.css'
import send from "../assets/send.png"

function Home() {
    const [message, setMessage] = useState('')
    const [file, setFile] = useState()
    const [data, setData] = useState([])
    const [group, setGroups] = useState([])
    const fileInput = useRef(null);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const groupId = localStorage.getItem('groupId')
    const userDetail = JSON.parse(localStorage.getItem('user'));
    const userId = userDetail.userId
    const userName = userDetail.userName
    const socket = io('http://localhost:3000', {
        transport: 'websocket',
    });
    socket.on('connect', () => {
        console.log('WebSocket connected');
    });

    // This code will run when the socket is disconnected
    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });
    const handleNewMessage = (newMessage) => {
        console.log('Received new message:', groupId);
        console.log(newMessage);
        setData((prevData) => [...prevData, newMessage]);
        console.log(data);
    };
    function handleNewimage(newImage) {
        console.log('Received new image:');
        console.log(newImage);
    
        // Convert ArrayBuffer to a Blob
        const blob = new Blob([newImage.image]);
    
        // Create a data URL from the Blob
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataURL = e.target.result;
    
            // Create an object containing the image data
            const imageObject = {
                userId: newImage.userId,
                userName: newImage.userName,
                currentTime: newImage.currentTime,
                image: dataURL, // Store the data URL in the object
            };
    
            // Update the state with the new image object
            setData((prevData) => [...prevData, imageObject]);
        };
        reader.readAsDataURL(blob);
    }
    
    useEffect(() => {
        socket.on('message', handleNewMessage);
        socket.on('image', handleNewimage);
        return () => {
            socket.disconnect();
        };
    }, []);

    async function handleSend(e) {
        e.preventDefault();
        if (file) {
            // const messObj = { message: "please reloade to get the image" };
            // socket.emit("chat-message", { messObj, groupId })
            const formData = new FormData();
            formData.append('file', file); // 'file' should match the field name on the server
            formData.append('groupId', groupId);
            // await axios.post(`http://localhost:3000/chat/${groupId}`, formData, {
            //     headers: {
            //         "Authorization": token,
            //         "Content-Type": "multipart/form-data", // Important for file uploads
            //     },
            // });
            socket.emit("image", { image:file, groupId, userId, userName })
            setFile('')
            console.log("file send successfully");
        }
        else {
            await axios.post(`http://localhost:3000/chat/${groupId}`, { message }, { headers: { "Authorization": token } })
            console.log(message, groupId, userId);
            socket.emit("chat-message", { message, groupId, userId, userName })
            setMessage('');
        }
    }



    useEffect(() => {
        async function fetchMessages() {
            try {
                // console.log(groupId);
                // console.log('useeffect');
                const response = await axios.get(`http://localhost:3000/messages/${groupId}`);
                const newMessage = response.data.data;
                console.log(newMessage);
                console.log("response");
                console.log(response);
                setData(newMessage);
                localStorage.setItem('messages', JSON.stringify(newMessage));
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        fetchMessages();
    }, [groupId]);

    useEffect(() => {
        async function fetchGroup() {
            const groups = await axios.get('http://localhost:3000/joinedGroups', { headers: { Authorization: token } });
            console.log(groups.data.groups);
            setGroups(groups.data.groups);
            const groupId = JSON.parse(localStorage.getItem('groupId')) || [];
            console.log(groupId);
            setSelectedId(groupId);
            setMessage('')
        }

        fetchGroup();
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
        console.log("new message");
        console.log(newMessage);
        setData(newMessage)
        localStorage.setItem("messages", JSON.stringify(newMessage))
        setSelectedId(id);
    }
    function handleFile() {
        fileInput.current.click()
    }
    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        console.log("Got file", selectedFile.name);
        setFile(selectedFile)
        // setMessage(selectedFile.name)
    }
    return (
        <div className={Style.main}>
            <div className={Style.leftSection}>
                <h1>Chat App</h1>
                <div className={Style.body}>
                    <div className={Style.chats}>
                        {data.length === 0 ? (
                            <h3>No chats to show</h3>
                        ) : (
                            data.map((i, index) => (
                                <div key={index}>
                                    {i.userId == userId ? (
                                        <div className={Style.userMessage}>

                                            <div className={Style.messageContent}>
                                                <div className={Style.userInfo}>
                                                    <h5 className={Style.first}>You</h5>
                                                    <h5>{i.currentTime}</h5>
                                                </div>
                                                {i.message ? (
                                                    <h4>{i.message}</h4>
                                                ) : (
                                                    <img src={i.image} alt="Image" />
                                                )}
                                            </div>

                                        </div>

                                    ) : (
                                        <div className={Style.otherMessage}>
                                            <div className={Style.messageContent}>
                                                <div className={Style.userInfo}>
                                                    <h5 className={Style.first}>{i.userName}</h5>
                                                    <h5>{i.currentTime}</h5>
                                                </div>
                                                {i.message ? (
                                                    <h4>{i.message}</h4>
                                                ) : (
                                                    <img src={i.image} alt="Image" />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        <div className={Style.typeBar}>
                            <input type="text" onChange={(e) => setMessage(e.target.value)} />
                            <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: 'none' }} />
                            <button onClick={handleFile} className={Style.inputFile}>📄</button>
                            <button onClick={handleSend}><img src={send}/>Send</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={Style.rightSection}>
                <div className={Style.groupHeader}>
                    <h1>Groups</h1>
                    <div className={Style.createGroupButton}>
                        <button onClick={handleCraeteGroup} >Create Group</button>
                    </div>
                </div>
                <div className={Style.groups}>
                    {group.map((i, id) => (
                        <div key={id}>
                            <button onClick={(e) => handleGroupChange(e, i.id)}
                                style={{
                                    backgroundColor: selectedId === i.id ? 'white' : 'initial',
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