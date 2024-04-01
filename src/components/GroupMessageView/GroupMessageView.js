import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar } from 'antd'; // Importa el componente Avatar de Ant Design
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './GroupMessageView.css'; // Asegúrate de que el nombre del archivo CSS sea correcto
import NewMessageModal from '../NewGroupMessageModal/NewGroupMessageModal'; // Ajusta la ruta según la estructura de tu proyecto


function GroupMessagesView() {
    // Simulamos la obtención de los mensajes del grupo
    const [messages, setMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageBody, setMessageBody] = useState('');
    const userActual = sessionStorage.getItem('username');
    const group_id = sessionStorage.getItem('group_id');
    const clave_simetrica = sessionStorage.getItem('group_key');
    const { group,} = useParams();

    const sendGroupMessage = async(encryptedMessage) => {
        try{
            const response = await fetch(`http://localhost:5000/messages/groups/${group}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: userActual,
                message: encryptedMessage,
              }),
            });
            const data = await response.json();
            console.log(data);
        }
        catch(error){
            console.error('Error sending message:', error);
        }
    }

    const decryptMessage = async(encryptedMessageBase64, symmetricKeyBase64) => {
        // Convertir la clave simétrica de base64 a ArrayBuffer
        const keyBuffer = Uint8Array.from(atob(symmetricKeyBase64), c => c.charCodeAt(0));
        const importedKey = await window.crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    
        // Convertir el mensaje encriptado de base64 a ArrayBuffer
        const encryptedMessageBuffer = Uint8Array.from(atob(encryptedMessageBase64), c => c.charCodeAt(0)).buffer;
    
        // Desencriptar el mensaje
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(12) }, // Usando el mismo IV estático para simplicidad
            importedKey,
            encryptedMessageBuffer
        );
    
        // Convertir datos desencriptados a cadena de texto
        const decoder = new TextDecoder();
        const decryptedMessage = decoder.decode(decryptedData);
    
        return decryptedMessage;
    }

    const getGroupMessages = async() => {
        try{
            const response = await fetch(`http://localhost:5000/messages/groups/${group_id}`);
            const data = await response.json();
            console.log("Mensajes encriptados:", data);
    
            // Desencriptar cada mensaje
            const decryptedMessages = await Promise.all(data.map(async (message) => {
                const decryptedContent = await decryptMessage(message.mensaje, clave_simetrica);
                return {
                    ...message,
                    mensaje: decryptedContent, // Actualizar el mensaje con el contenido desencriptado
                };
            }));
    
            setMessages(decryptedMessages);
        }
        catch(error){
            console.error('Error fetching messages:', error);
        }
    };

    const encryptMessage = async(message, symmetricKeyBase64) => {
        // Convertir la clave simétrica de base64 a un formato usable
        const keyBuffer = Uint8Array.from(atob(symmetricKeyBase64), c => c.charCodeAt(0));
        const importedKey = await window.crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    
        const encoder = new TextEncoder();
        const encodedMessage = encoder.encode(message);
    
        // En este caso no usamos IV para simplificar basándonos en tu escenario
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: new Uint8Array(12) }, // Aunque no uses IV, es necesario proporcionar uno para AES-GCM
            importedKey,
            encodedMessage
        );
    
        // Convertir datos encriptados a base64 para enviar
        const base64EncryptedMessage = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    
        return base64EncryptedMessage;
    }


    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSend = async () => {
        const claveSimetricaBase64 = clave_simetrica;
        if (!claveSimetricaBase64) {
            console.error("No se encontró la clave simétrica");
            return;
        }
        
        const encryptedMessage = await encryptMessage(messageBody, claveSimetricaBase64);
        sendGroupMessage(encryptedMessage);
        
        console.log("Mensaje encriptado:", encryptedMessage);
        // Aquí podrías enviar 'encryptedMessage' a tu backend o donde necesites
        
        setMessageBody(''); // Limpiar el cuerpo del mensaje
        toggleModal(); // Cerrar el modal
    };


    useEffect(() => {
        getGroupMessages()
    }, []);

    return (
        <div className="AppBg">
            <div className="group-messages-view-container">
                
                        <div className="header">
                            <Link to="/messages" className="return-link">
                                <ArrowLeftOutlined className="return-icon" />
                                <span>Volver</span>
                            </Link>
                            {/* Botón para abrir el modal */}
                            <button onClick={toggleModal} className="send-message-button">Enviar Mensaje</button>
                        </div>
                        <div className="messages-wrapper">
                            {/* Renderización de mensajes existentes */}
                            {messages.map((message, index) => (
                                <div key={index} className="group-message-container"> {/* Uso del índice como key */}
                                    <Avatar className="avatar" size={64} icon={<UserOutlined />} />
                                    <div className="message-header-group">
                                        <h2 className="message-sender">{message.author}</h2>
                                        <p className="message-content">{message.mensaje}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    
            </div>
            {/* Renderizar NewMessageModal */}
            <NewMessageModal
                isOpen={isModalOpen}
                toggleModal={toggleModal}
                messageBody={messageBody}
                setMessageBody={setMessageBody}
                handleSend={handleSend}
            />
        </div>
    );
    
}

export default GroupMessagesView;
