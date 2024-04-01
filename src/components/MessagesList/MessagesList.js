import MessageTile from '../MessageTile/MessageTile';
import './MessagesList.css';
import NewGroupModal from '../NewGroupModal/NewGroupModal';
import NewMessageModal from '../NewMessageModal/NewMessageModal';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';


function MessagesList() {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsReal, setGroupsReal] = useState([]);
    const userActual = sessionStorage.getItem('username');

    const DeleteUser = async() => {
        try{
            const response = await fetch(`http://localhost:5000/users/${userActual}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
        }
        catch(error){
            console.log(error);
        }
    }

    const getUsers = async() => {
        try{
            const response = await fetch('http://localhost:5000/users');
            const data = await response.json();
            console.log(data);
            setUsers(data);
        }
        catch(error){
            console.log(error);
        }
        
        
    }

    const getGroupsReal = async(groups, userActual, setGroupsReal) => {
        const filteredGroups = groups.filter(group => group.usuarios.includes(userActual));
        setGroupsReal(filteredGroups);
    }


    const getGroups = async() => {
        try{
            const response = await fetch('http://localhost:5000/groups');
            const data = await response.json();
            console.log(data);
            setGroups(data);
        }
        catch(error){
            console.log(error);
        }

    }

    const handleModalClose = () => {
        setShowModal(false);
    };

    useEffect(() => {
        getUsers();
        getGroups();
    }, []);

    useEffect(() => {

        getGroupsReal(groups, userActual, setGroupsReal);

    }, [groups]);

    return (
        <div className='AppBg'>
            <div className='top-bar'>
                <h1 className="messages-title" style={{color: 'white'}}>Messages</h1>
                <button className='delete-button' onClick={() => {DeleteUser(); navigate('/')}}>Eliminar usuario</button>
            </div>
            <div className='grouped-messages'>
                <div className='message-group'>
                    <div className="header-container">
                        <h2>Direct Messages</h2>
                        {/* <button className='new-message-button' onClick={toggleModal}>New Message</button> */}
                    </div>
                    {users.length === 0 ? <p>Loading...</p> : users.map((user, index) => {
                        return <MessageTile key={index} message={user} />
                    })}
                </div>
                <div className='message-group'>
                    <div className="header-container">
                        <h2>Group Messages</h2>
                        <button className='new-group-button' onClick={() => setShowModal(true)}>New Group</button>
                    </div>
                    {groupsReal.length === 0 ? <p>No groups available</p> : groupsReal.map((nombre, index) => {
                        return <MessageTile key={index} message={nombre} />
                    })}
                </div>
            </div>
            <NewGroupModal isOpen={showModal} onClose={handleModalClose} allUsers={users}/>
        </div>
    );
    
    
}

export default MessagesList;
