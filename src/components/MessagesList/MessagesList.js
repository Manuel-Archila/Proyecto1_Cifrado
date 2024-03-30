import MessageTile from '../MessageTile/MessageTile';
import './MessagesList.css';
import NewGroupModal from '../NewGroupModal/NewGroupModal';
import NewMessageModal from '../NewMessageModal/NewMessageModal';
import React, {useState} from 'react';


function MessagesList() {


    const [showModal, setShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [users, setUsers] = useState(['Messi', 'Xavi', 'Andres', 'Maria', 'Zack', 'Leo']);

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

    const getMessages = (username) => {
        // * Fetch messages *
        return [
            {
                id: '1',
                message: 'Hola, como estas?',
                username_origen : 'Messi',
                username_destino: 'Xavi'
            },
            {
                id: '2',
                message: 'fdsafdsaf',
                username_origen : 'Andres',
                username_destino: 'Maria'
            },
            {
                id: '3',
                message: 'Adios!',
                username_origen : 'Zack',
                username_destino: 'Leo'
            },
            {
                id: '4',
                message: 'Hola, como estas?',
                username_origen : 'Messi',
                username_destino: 'Xavi'
            },
            {
                id: '5',
                message: 'fdsafdsaf',
                username_origen : 'Andres',
                username_destino: 'Maria'
            },
            {
                id: '6',
                message: 'Adios!',
                username_origen : 'Zack',
                username_destino: 'Leo'
            }
        ]
    }

    const getGroupMessages = (id) => {

        return [
            {
                id: '1',
                id_group: '1',
                author: 'Ronaldinho',
                message: 'Sale furbito?',
            },
            {
                id: '2',
                id_group: '1',
                author: 'Andres',
                message: 'Claro que si',
            },
            {
                id: '3',
                id_group: '2',
                author: 'Alan',
                message: 'Hola, desde el grupo 2',
            },
            {
                id: '4',
                id_group: '3',
                author: 'Jessie',
                message: 'Hola, desde el grupo 3',
            }
        ]
    }

    const messages = getMessages('usuario');

    return (
        <div className='AppBg'>
            <h1 style={{color: 'white'}}>Messages</h1>
            <div className='grouped-messages'>
                <div className='message-group'>
                    <div className="header-container">
                        <h2>Direct Messages</h2>
                        <button className='new-message-button' onClick={toggleModal}>New Message</button>
                    </div>
                    {messages.map((message, index) => {
                        return <MessageTile key={index} message={message} />
                    })}
                </div>
                <div className='message-group'>
                    <div className="header-container">
                        <h2>Group Messages</h2>
                        <button className='new-group-button' onClick={() => setShowModal(true)}>New Group</button>
                    </div>
                    {getGroupMessages().map((message, index) => {
                        return <MessageTile key={index} message={message} />
                    })}
                </div>
            </div>
            <NewGroupModal isOpen={showModal} onClose={handleModalClose} />
            <NewMessageModal
                isOpen={isModalOpen}
                toggleModal={toggleModal}
                users={users}
                recipient={recipient}
                setRecipient={setRecipient}
                messageBody={messageBody}
                setMessageBody={setMessageBody}
                handleSend={handleSend}
            />
        </div>
    );
    
    
}

export default MessagesList;
