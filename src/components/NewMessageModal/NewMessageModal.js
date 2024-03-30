// MessageModal.js
import React from 'react';
import './NewMessageModal.css'; // Asume que tienes estilos específicos para el modal

const NewMessageModal = ({ isOpen, toggleModal, users, recipient, setRecipient, messageBody, setMessageBody, handleSend }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                <h2>New Message</h2>
                <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                >
                    <option value="">Select a user</option>
                    {users.map((user, index) => (
                        <option key={index} value={user}>{user}</option>
                    ))}
                </select>
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
