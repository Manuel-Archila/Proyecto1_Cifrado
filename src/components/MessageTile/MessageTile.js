import './MessageTile.css';
import { Divider, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';



function MessageTile({ message }) {
    

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [password, setPassword] = useState('');

    const handleDeleteGroup = (e) => {
        e.stopPropagation(); // Evita que el evento se propague al div padre
        setIsModalVisible(true);
    };

    const handleConfirmDelete = () => {
        // Aquí puedes agregar la lógica para eliminar el grupo después de verificar la contraseña
        console.log(password);
        console.log(message.nombre);
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

    // return (
    //     <div onClick={message.nombre ? goToGroup : goToMessage} className='message-tile'>
    //         <div className='message-tile-content'>
    //             <Avatar id='avatar_icon' style={avatar_color} size={64} icon={<UserOutlined />} />
    //             <p className='msg-content'>{message.nombre ? `Nombre del grupo: ${message.nombre}` : `From: ${message.username}`}</p>
    //             {/* <p className='msg-content'>To: {message.id_group ? `Grupo #${message.id_group}` : message.username_destino }</p> */}
    //             {/* <p id='message-content'>{message.message}</p> */}
    //         </div>
    //         <Divider id='message_divider' style={{borderTop: '1px solid #252525'}}/>
    //     </div>
    // );
    
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