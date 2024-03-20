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

    let avatar_color = {
        color: 'lightgreen'
    };

    if(message.group_id){
        avatar_color = {
            color: 'red'
        };
    }

    return (
        <div onClick={goToMessage} className='message-tile'>
            <Avatar id='avatar_icon' style={avatar_color} size={64} icon={<UserOutlined />} />
            <div className='message-tile-content'>
                <p>From: {message.username_origen}</p>
                <p>To: {!message.group_id ? message.username_destino : `Grupo #${message.group_id}`}</p>
                <p id='message-content'>{message.message}</p>
            </div>
            <Divider style={{borderTop: '1px solid #252525'}}/>
        </div>
    );
}

export default MessageTile;