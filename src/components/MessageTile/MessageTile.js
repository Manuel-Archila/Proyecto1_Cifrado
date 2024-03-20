import './MessageTile.css';
import React from 'react';
import { Divider, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';


function MessageTile({ message }) {

    const navigate = useNavigate();

    const goToMessage = () => {
        navigate(`/messages/${message.id}`);
    }

    return (
        <div onClick={goToMessage} className='message-tile'>
            <Avatar size={64} icon={<UserOutlined />} />
            <div className='message-tile-content'>
                <p>From: {message.username_origen}</p>
                <p>To: {message.username_destino}</p>
                <p>{message.message}</p>
            </div>
            <Divider />
        </div>
    );
}

export default MessageTile;