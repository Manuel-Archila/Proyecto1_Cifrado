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


    const handleConfirmDelete = async () => {
        const getPassword = async () => {
            // Esta función obtiene la contraseña cifrada y la clave simétrica de la base de datos
            try {
                const response = await fetch(`http://localhost:5000/groups/${message.nombre}/password`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                return { encryptedPassword: data.password, symmetricKey: sessionStorage.getItem('group_key') };
            } catch (error) {
                console.error(error);
                return null;
            }
        };
    
        const { encryptedPassword, symmetricKey } = await getPassword();
    
        if (!encryptedPassword || !symmetricKey) {
            console.error("No se pudo obtener la contraseña o la clave simétrica");
            return;
        }
    
        // const decryptedPassword = await decryptMessage(encryptedPassword, symmetricKey);
    
        if (password === encryptedPassword) {
            console.log("Contraseña correcta. Procediendo a eliminar el grupo.");

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
            // Aquí iría la lógica para eliminar el grupo
        } else {
            console.error("Contraseña incorrecta");
        }
    
        setIsModalVisible(false);
    };
    

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const decryptMessage = async (encryptedMessageBase64, symmetricKeyBase64) => {
        console.log(encryptedMessageBase64);
        console.log(symmetricKeyBase64);

        const keyBuffer = Uint8Array.from(atob(symmetricKeyBase64), c => c.charCodeAt(0));
        const importedKey = await window.crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['decrypt'] // Solo necesitamos el permiso de descifrado aquí
        );
    
        // Convertir el mensaje cifrado de base64 a un ArrayBuffer
        const encryptedData = Uint8Array.from(atob(encryptedMessageBase64), c => c.charCodeAt(0)).buffer;
    
        const iv = new Uint8Array(12).fill(0);
    
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            importedKey,
            encryptedData
        );
    
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
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