import './MessageTile.css';
import React from 'react';
import { Divider, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';


function MessageTile({ message }) {

    const navigate = useNavigate();

    const goToMessage = () => {
        navigate(`/messages/${message.id}`);
        console.log(message)
    }
    const goToGroup = () => {
        navigate(`/group/${message.id_group}`);
        console.log(message)
    }

    let avatar_color = {
        color: 'lightgreen'
    };

    if(message.id_group){
        avatar_color = {
            color: 'red'
        };
    }

    return (
        <div onClick={message.id_group ? goToGroup : goToMessage} className='message-tile'>
            <div className='message-tile-content'>
                <Avatar id='avatar_icon' style={avatar_color} size={64} icon={<UserOutlined />} />
                <p className='msg-content'>{message.id_group ? `ID group: ${message.id_group}` : `From: ${message.username_origen}`}</p>
                {/* <p className='msg-content'>To: {message.id_group ? `Grupo #${message.id_group}` : message.username_destino }</p> */}
                {/* <p id='message-content'>{message.message}</p> */}
            </div>
            <Divider id='message_divider' style={{borderTop: '1px solid #252525'}}/>
        </div>
    );
    // return (
    //     <div onClick={goToMessage} className='message-tile'>
    //         {/* Contenido del mensaje */}
    //     </div>
    // );
}

export default MessageTile;