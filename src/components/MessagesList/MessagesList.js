import MessageTile from '../MessageTile/MessageTile';
import './MessagesList.css';
import React from 'react';

function MessagesList() {

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

    // const getGroupMessages = (id) => {
    //     // * Fetch group messages *

    //     return [
    //         {},
    //         {},
    //         {}
    //     ]
    // }

    const messages = getMessages('usuario');

    return (
        <div className='AppBg'>
            <h1 style={{color: 'white'}}>Messages</h1>
            <div className='grouped-messages'>
                {messages.map((message, index) => {
                    return <MessageTile key={index} message={message} />
                })}
            </div>
        </div>
    );
}

export default MessagesList;
