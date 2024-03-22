import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar } from 'antd'; // Importa el componente Avatar de Ant Design
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './SingleMessageView.css'; // Importa el archivo CSS

function SingleMessageView() {
    // Obtenemos el parámetro de la URL que contiene el ID del mensaje
    const { id } = useParams();

    // Llamada al API para obtener los detalles del mensaje con el ID proporcionado
    const message = {
        id: id,
        sender: 'Messi',
        recipient: 'Recipient Name',
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'
    };

    return (
        <div className="single-message-view-container"> {/* Clase única para el contenedor principal */}
            <div className="AppBg"> {/* Aplica la clase AppBg para usar el mismo fondo */}
                <div className="single-message-container"> {/* Aplica el estilo del contenedor principal */}
                    <div className="header">
                        <Link to="/messages" className="return-link"> {/* Enlace de retorno */}
                            <ArrowLeftOutlined className="return-icon" /> {/* Ícono de flecha */}
                            <span></span> {/* Texto del enlace */}
                        </Link>
                    </div>
                    <Avatar id='avatar_icon' className="avatar" size={64} icon={<UserOutlined />} /> {/* Agrega el avatar */}
                    <h2 className="message-title"> {message.sender}</h2> {/* Aplica el estilo del título */}
                    <p className="message-content">{message.content}</p>
                    {/* Otros detalles del mensaje si los hubiera */}
                </div>
            </div>
        </div>
    );
}

export default SingleMessageView;
