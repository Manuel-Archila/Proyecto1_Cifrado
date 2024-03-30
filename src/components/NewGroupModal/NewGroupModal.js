import React, { useState } from 'react';
// Asegúrate de importar el CSS si es diferente al del NewMessageModal
import './NewGroupModal.css'; 

function NewGroupModal({ isOpen, onClose }) {
    const [groupName, setGroupName] = useState('');
    const [userList, setUserList] = useState('');
    const [password, setPassword] = useState('');

    async function generateAndExportSymmetricKey() {
        try {
            const key = await window.crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256,
                },
                true,
                ["encrypt", "decrypt"]
            );
    
            // Exportar la clave a formato raw
            const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    
            return exportedKey;
        } catch (error) {
            console.error("Error generating or exporting key:", error);
            return null;
        }
    }

    function bufferToBase64(buf) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
    }
    
    
    

    const handleNewGroupSubmit = async () => {
        const exportedKeyBuffer = await generateAndExportSymmetricKey();
        if (!exportedKeyBuffer) {
            console.error("No se pudo generar la clave.");
            return;
        }
    
        // Convertir la clave exportada a Base64
        const exportedKeyBase64 = bufferToBase64(exportedKeyBuffer);
        console.log("Clave simétrica en Base64:", exportedKeyBase64);
    
        console.log("Nombre del grupo:", groupName);
        console.log("Lista de usuarios:", userList);
        console.log("Contraseña:", password);
    
        // Aquí iría la lógica para usar la clave exportada
    
        onClose(); // Cierra el modal
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
                <input
                    type="text"
                    placeholder="User List (comma separated)"
                    value={userList}
                    onChange={(e) => setUserList(e.target.value)}
                />
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
