import React, { useEffect, useState } from 'react';
import '../styles/Perfil.css';

function Perfil() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      fetch('http://127.0.0.1:8000/conseguir_mi_usuario/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
          }
          return response.json();
        })
        .then(data => {
          setUserData(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <div className="perfil-wrapper">
      <div className="perfil-container">
        <div className="perfil-avatar">
          <i className='bx bxs-user-circle'></i>
        </div>
        <h2>Mi Perfil</h2>
        {userData ? (
          <div className="perfil-info">
            <p><i className='bx bxs-user'></i> <strong>Nombre:</strong> {userData.nombre_usuario}</p>
            <p><i className='bx bxs-envelope'></i> <strong>Correo:</strong> {userData.correo}</p>
          </div>
        ) : (
          <p className="cargando"><i className='bx bx-loader bx-spin'></i> Cargando datos...</p>
        )}
      </div>
    </div>
  );
}

export default Perfil;