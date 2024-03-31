import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar } from 'antd'; // Importa el componente Avatar de Ant Design
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './SingleMessageView.css'; // Importa el archivo CSS
import NewMessageModal from '../NewMessageModal/NewMessageModal';

function SingleMessageView() {
    // Obtenemos el parámetro de la URL que contiene el ID del mensaje
    const { username } = useParams();
    const userActual = sessionStorage.getItem('username');
    const [publicKey, setPublicKey] = useState('');
    const [sentMessages, setSentMessages] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageBody, setMessageBody] = useState('');
    
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const importPrivateKey = async (privateKeyBase64) => {
        const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
        const privateKey = await window.crypto.subtle.importKey(
          "pkcs8",
          privateKeyBuffer,
          {
            name: "RSA-OAEP",
            hash: {name: "SHA-256"},
          },
          true,
          ["decrypt"]
        );
        return privateKey;
    };

    const decryptMessage = async (encryptedMessageBase64, privateKeyBase64) => {
        const privateKey = await importPrivateKey(privateKeyBase64);
        const encryptedMessageBuffer = Uint8Array.from(atob(encryptedMessageBase64), c => c.charCodeAt(0));
        const decryptedMessage = await window.crypto.subtle.decrypt(
          {
            name: "RSA-OAEP",
          },
          privateKey,
          encryptedMessageBuffer
        );
        const decodedMessage = new TextDecoder().decode(decryptedMessage);
        return decodedMessage;
    };

    const SendMessage = async(encryptedMessage) => {
        try{
            const response = await fetch(`http://localhost:5000/messages/${username}`, {
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
            console.log(error);
        }
      }

    const importPublicKey = async (publicKeyBase64) => {
        const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
        const publicKey = await window.crypto.subtle.importKey(
          "spki",
          publicKeyBuffer,
          {
            name: "RSA-OAEP",
            hash: {name: "SHA-256"},
          },
          true,
          ["encrypt"]
        );
        return publicKey;
      };
      
      // Función para encriptar un mensaje con la clave pública
      const encryptMessage = async (message, publicKeyBase64) => {
        const publicKey = await importPublicKey(publicKeyBase64);
        const encodedMessage = new TextEncoder().encode(message);
        const encryptedMessage = await window.crypto.subtle.encrypt(
          {
            name: "RSA-OAEP",
          },
          publicKey,
          encodedMessage
        );
        const encryptedMessageBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));
        return encryptedMessageBase64;
      };

    const handleSend = async() => {
        console.log(`Sending message: ${messageBody}`);
        
        toggleModal();
        
        const encryptedMessage = await encryptMessage(messageBody, publicKey);
        console.log("Mensaje cifrado:", encryptedMessage);

        SendMessage(encryptedMessage);


        setMessageBody('');
    };

    const getPublicKey = async() =>  {
        try{
            const response = await fetch(`http://localhost:5000/users/${username}/key`);
            const data = await response.json();
            console.log(data);
            setPublicKey(data.public_key);
        } catch(error){
            console.log(error);
        }
    }

    const getSentMessages = async() => {
        try {
            // Hacer la petición para obtener los mensajes
            const response = await fetch(`http://localhost:5000/messages/users/${username}/${userActual}`);
            let data = await response.json();
    
            // Obtener la clave privada del sessionStorage
            const privateKeyBase64 = sessionStorage.getItem('privateKey'); 
    
            // Inicializar un arreglo para almacenar los mensajes después de intentar desencriptarlos
            const processedMessages = [];
    
            // Iterar sobre cada mensaje recibido
            for (const message of data) {
                // Verificar si el mensaje es para el usuario actual y si hay una clave privada disponible
                if (message.username_destino === userActual && privateKeyBase64) {
                    try {
                        // Intentar desencriptar el mensaje
                        const decryptedContent = await decryptMessage(message.message, privateKeyBase64);
                        // Si la desencriptación es exitosa, actualizar el mensaje con el contenido desencriptado
                        processedMessages.push({...message, message: decryptedContent});
                    } catch(error) {
                        // Si hay un error en la desencriptación, mantener el mensaje original (cifrado)
                        processedMessages.push(message);
                    }
                } else {
                    // Si el mensaje no es para el usuario actual, agregarlo sin modificaciones
                    processedMessages.push(message);
                }
            }
    
            // Actualizar el estado con los mensajes procesados (desencriptados o originales en caso de error)
            setSentMessages(processedMessages);
        } catch(error) {
            console.log("Error al obtener los mensajes:", error);
        }
    };
    

    useEffect(() => {
        getPublicKey();
    }, []);

    useEffect(() => {
        getSentMessages();

    }, [publicKey]);

    
    return (
        <div className="single-message-view-container">
            <div className="AppBg">
                <div className="messages-scroll-container">
                    <button className='new-message-button' onClick={toggleModal}>New Message</button>
                    {sentMessages.length === 0 ? (
                        <div className="single-message-container">
                            <div className="header">
                                <Link to="/messages" className="return-link">
                                    <ArrowLeftOutlined className="return-icon" />
                                </Link>
                            </div>
                            <p className="message-content">No hay mensajes</p>
                        </div>
                    ) : (
                        sentMessages.map(message => (
                            <div key={message.id} className="single-message-container">
                                <div className="header">
                                    <Link to="/messages" className="return-link">
                                        <ArrowLeftOutlined className="return-icon" />
                                    </Link>
                                </div>
                                <Avatar className="avatar" size={64} icon={<UserOutlined />} />
                                <h2 className="message-title">{message.username_origen}</h2>
                                <p className="message-content">{message.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

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

export default SingleMessageView;
