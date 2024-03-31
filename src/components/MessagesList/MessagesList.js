import MessageTile from '../MessageTile/MessageTile';
import './MessagesList.css';
import NewGroupModal from '../NewGroupModal/NewGroupModal';
import NewMessageModal from '../NewMessageModal/NewMessageModal';
import React, {useEffect, useState} from 'react';


function MessagesList() {


    const [showModal, setShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsReal, setGroupsReal] = useState([]);
    const [userActual, setUserActual] = useState('');

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

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSend = () => {
        console.log(`Sending message to ${recipient}: ${messageBody}`);
        toggleModal();
        // Restablece el estado del formulario
        setRecipient('');
        setMessageBody('');
    };

    useEffect(() => {
        getUsers();
        getGroups();
        setUserActual(sessionStorage.getItem('username'));
    }, []);

    useEffect(() => {

        getGroupsReal(groups, userActual, setGroupsReal);

    }, [groups]);

    return (
        <div className='AppBg'>
            <h1 style={{color: 'white'}}>Messages</h1>
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
