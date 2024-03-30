import React from 'react';
import './NewGroupMessageModal.css'; // Asume que tienes estilos específicos para el modal

const NewMessageModal = ({ isOpen, toggleModal, messageBody, setMessageBody, handleSend }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                <h2>New Message</h2>
                <textarea
                    placeholder="Your message here..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                ></textarea>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default NewMessageModal;
