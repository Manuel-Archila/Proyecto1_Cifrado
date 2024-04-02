import './MessageTile.css';
import { Divider, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';



function MessageTile({ message }) {
    

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [contra, setContra] = useState('');
    

    const handleDeleteGroup = (e) => {
        e.stopPropagation(); // Evita que el evento se propague al div padre
        setIsModalVisible(true);
    };


    const handleConfirmDelete = async() => {

        const getPassword = async() =>{
            try{
                const response = await fetch(`http://localhost:5000/groups/${message.nombre}/password`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                setContra(data.password);
                return data.password
            }
            catch(error){
                console.log(error);
            }
        }

        const passW = await getPassword()
        console.log('PASSW', passW)

        
        
        
        if(password === passW){
            console.log(passW);
            try{
                const response = await fetch(`http://localhost:5000/groups/${message.nombre}`, {
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
        else{
            console.log(passW);
            console.log("Contraseña incorrecta")
        }

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleTileClick = (e) => {
        // Verifica si el clic proviene del avatar de eliminación
        if (!e.target.classList.contains('delete-avatar')) {
            message.nombre ? goToGroup() : goToMessage();
        }
    };

    const navigate = useNavigate();

    

    const goToMessage = () => {
        navigate(`/messages/${message.username}`);
        console.log(message)
    }
    const goToGroup = () => {
        navigate(`/group/${message.nombre}`);
        sessionStorage.setItem('group_id', message.id);
        sessionStorage.setItem('group_key', message.clave_simetrica);


        console.log(message)
    }

    let avatar_color = {
        color: 'lightgreen'
    };

    if(message.nombre){
        avatar_color = {
            color: 'red'
        };
    }

    
    return (
        <div className='message-tile'>
            <div onClick={message.nombre ? goToGroup : goToMessage} className='message-tile-content'>
                <Avatar id='avatar_icon' style={avatar_color} size={64} icon={<UserOutlined />} />
                <p className='msg-content'>{message.nombre ? `Nombre del grupo: ${message.nombre}` : `From: ${message.username}`}</p>
            </div>
            {message.nombre && (
                <div className='delete-button' onClick={handleDeleteGroup} style={{ width: '10%' }}>
                    <Avatar id='delete-avatar' style={{ backgroundColor: 'red' }} size={32} icon={<DeleteOutlined />} />
                </div>
            )}
            <Divider id='message_divider' style={{borderTop: '1px solid #252525'}}/>
            <Modal title="Confirmación de Eliminación" visible={isModalVisible} onOk={handleConfirmDelete} onCancel={handleCancel}>
                <p>Ingresa la contraseña para confirmar la eliminación del grupo:</p>
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Modal>
        </div>
    );
}

export default MessageTile;