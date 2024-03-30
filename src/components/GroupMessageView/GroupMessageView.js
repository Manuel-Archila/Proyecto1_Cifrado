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
    const [userActual, setUserActual] = useState('');
    const { group } = useParams(); 

    useEffect(() => {
        setUserActual(sessionStorage.getItem('username'));
    }, []);


    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSend = () => {
        console.log("Mensaje enviado:", messageBody);
        console.log("Usuario del mensaje:", userActual);
        console.log("El ID del grupo es:", group)
        

        setMessageBody(''); 
        toggleModal(); 
};


    useEffect(() => {
        // Simula una llamada al API para obtener mensajes
        const fetchedMessages = [
            { id: '1', sender: 'Messi', content: 'Este es un mensaje de ejemplo bastante largo para ver cómo maneja el diseño el texto extenso.' },
            { id: '2', sender: 'Ronaldo', content: 'Aquí hay otro mensaje de ejemplo.' },
            // Agrega más mensajes según sea necesario
        ];
        setMessages(fetchedMessages);
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
                    {messages.map((message) => (
                        <div key={message.id} className="group-message-container">
                            <Avatar className="avatar" size={64} icon={<UserOutlined />} />
                            <div className="message-header-group">
                                <h2 className="message-sender">{message.sender}</h2>
                                <p className="message-content">{message.content}</p>
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
