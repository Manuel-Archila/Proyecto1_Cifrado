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

    const getGroupMessages = (id) => {
        // * Fetch group messages *

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
                <h2 id='header_messages'>Direct Messages</h2>    
                {messages.map((message, index) => {
                    return <MessageTile key={index} message={message} />
                })}

                <h2 id='header_messages'>Group Messages</h2>
                {getGroupMessages().map((message, index) => {
                    return <MessageTile key={index} message={message} />
                })}


            </div>
        </div>
    );
}

export default MessagesList;
