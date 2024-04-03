import React, { useState } from 'react';
// Asegúrate de importar el CSS si es diferente al del NewMessageModal
import './NewGroupModal.css'; 

function NewGroupModal({ isOpen, onClose, allUsers }) {
    const [groupName, setGroupName] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([])
    const [clave_simetrica, setClaveSimetrica] = useState('');

    const createNewGroup = async(encryptedPasswordBase64) => {
        console.log(encryptedPasswordBase64);
        try {
            const response = await fetch('http://localhost:5000/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: groupName,
                    usuarios: selectedUsers,
                    contrasena: password,
                    clave_simetrica: clave_simetrica,
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error creating group:', error);
        }

    }


    const handleAddUser = () => {
        if (newUser && !selectedUsers.includes(newUser)) {
            setSelectedUsers([...selectedUsers, newUser]); // Agrega el nuevo usuario a la lista
            setNewUser(''); // Limpia el usuario seleccionado después de agregarlo
        }
    }

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

        const iv = new Uint8Array(12).fill(0);
    
        // En este caso no usamos IV para simplificar basándonos en tu escenario
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv }, // Aunque no uses IV, es necesario proporcionar uno para AES-GCM
            importedKey,
            encodedMessage
        );
    
        // Convertir datos encriptados a base64 para enviar
        const base64EncryptedMessage = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    
        return base64EncryptedMessage;
    }

    const generateAndExportSymmetricKey = async () => {
        try {
            const key = await window.crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 128,
                },
                true,
                ['encrypt', 'decrypt']
            );

            const exportedKey = await window.crypto.subtle.exportKey('raw', key);

            // Guarda también la clave para usarla en el cifrado directamente, no solo su versión exportada.
            return { exportedKey, key };
        } catch (error) {
            console.error('Error generating or exporting key:', error);
            return null;
        }
    };

    const bufferToBase64 = (buf) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
    };

    const handleNewGroupSubmit = async () => {
        const { exportedKey } = await generateAndExportSymmetricKey();
        if (!exportedKey) {
            console.error('No se pudo generar la clave.');
            return;
        }
        const exportedKeyBase64 = bufferToBase64(exportedKey);
        setClaveSimetrica(exportedKeyBase64);

        const encryptedPasswordBase64 = await encryptMessage(password, exportedKeyBase64);
        console.log("encrypted",encryptedPasswordBase64);
        setPassword(encryptedPasswordBase64);

        createNewGroup(encryptedPasswordBase64);

        setGroupName('');
        setSelectedUsers([]);
        setPassword('');

        onClose();
    };
    
    

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Create New Group</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <select
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                >
                    <option value="">Select User</option>
                    {allUsers.map((user) => (
                        <option key={user.id} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddUser}>Add User</button>
                <div>
                    {selectedUsers.map((user, index) => (
                        <div key={index}>{user}</div>
                    ))}
                </div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleNewGroupSubmit}>Create</button>
            </div>
        </div>
    );
}

export default NewGroupModal;
