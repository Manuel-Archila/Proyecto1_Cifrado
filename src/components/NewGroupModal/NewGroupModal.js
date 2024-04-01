import React, { useState } from 'react';
// Asegúrate de importar el CSS si es diferente al del NewMessageModal
import './NewGroupModal.css'; 

function NewGroupModal({ isOpen, onClose, allUsers }) {
    const [groupName, setGroupName] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([])
    const [clave_simetrica, setClaveSimetrica] = useState('');

    const createNewGroup = async() => {
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

    const encryptWithAES = async(text, key) => {
        const iv = new Uint8Array(16); // IV estático, por simplicidad se utiliza un array de ceros.
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
    
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv,
            },
            key,
            data
        );
    
        return encrypted;
    }

    const generateStaticKey = async() => {
        const key = await window.crypto.subtle.generateKey(
            {
                name: "AES-CBC",
                length: 128,
            },
            true,
            ["encrypt", "decrypt"]
        );
    
        return key;
    }

    const generateAndExportSymmetricKey = async()=> {
        try {
            const key = await window.crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 128,
                },
                true,
                ["encrypt", "decrypt"]
            );
    
            const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    
            return exportedKey;
        } catch (error) {
            console.error("Error generating or exporting key:", error);
            return null;
        }
    }
    

    const bufferToBase64 = (buf) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
    }

    const base64ToBuffer = (base64) => {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    
    
    

    const handleNewGroupSubmit = async () => {
        const exportedKeyBuffer = await generateAndExportSymmetricKey();
        if (!exportedKeyBuffer) {
            console.error("No se pudo generar la clave.");
            return;
        }
        const exportedKeyBase64 = bufferToBase64(exportedKeyBuffer);
        setClaveSimetrica(exportedKeyBase64);
        
        const aesKey = await generateStaticKey(); // Asegúrate de tener esta clave generada y accesible
        const encryptedPassword = await encryptWithAES(password, aesKey);
        const encryptedPasswordBase64 = bufferToBase64(encryptedPassword);
        setPassword(encryptedPasswordBase64);
        
        
        console.log("Nombre del grupo:", groupName);
        console.log("Lista de usuarios:", selectedUsers);
        console.log("Contraseña:", password);
        console.log("Clave simétrica en Base64:", exportedKeyBase64);
        console.log("Contrasena en Base64:", encryptedPasswordBase64);

        createNewGroup();

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
