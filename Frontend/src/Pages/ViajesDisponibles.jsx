import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../components/Public/Header';
import '../styles/Vuelos_disponibles.css'; 
import { useAuth } from '../context/AuthContext';

function ViajesDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [viajeIdaSeleccionado, setViajeIdaSeleccionado] = useState(null);
  const [viajeVueltaSeleccionado, setViajeVueltaSeleccionado] = useState(null);

  const {
    viajesIda = [],  
    viajesVuelta = [],  
    origen,
    destino,
    fechaSalida,
    fechaVuelta,
    personas,
    destinoId,
    autoSeleccionadoId,
    auto
  } = location.state || {};


  if (!viajesIda || !viajesVuelta) {
    return (
      <>
        <Header />
        <main className="main-container">
          <div className="error-message">
            <h2>Error: Datos no disponibles</h2>
            <p>No se encontraron datos de viajes. Por favor, realiza una nueva búsqueda.</p>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        </main>
      </>
    );
  }

  const handleSeleccionViajeIda = (viaje) => {
    setViajeIdaSeleccionado((prevViaje) => 
      prevViaje && prevViaje.id === viaje.id ? null : viaje
    ); 
  };

  const handleSeleccionViajeVuelta = (viaje) => {
    setViajeVueltaSeleccionado((prevViaje) => 
      prevViaje && prevViaje.id === viaje.id ? null : viaje
    );
  };

  const formatoPesos = (num) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(num || 0); 

  const handleContinuarSeleccionAsientos = () => {
    if (isAuthenticated) {
      navigate(`/reservar_asientos`, {
        state: {
          viajeIda: viajeIdaSeleccionado, 
          viajeVuelta: viajeVueltaSeleccionado,  
          personas,
          destinoId,
          autoSeleccionadoId,
          auto
        }
      });
    } else {
      alert("Por favor, inicie sesión para continuar con la reserva.");
      navigate('/login');
    }
  };

  return (
    <>
      <Header />
      <main className="main-container">
        <section className="datos-busqueda">
          <h2>Datos de tu búsqueda</h2>
          <p><strong>Origen:</strong> {origen || 'No especificado'}</p>
          <p><strong>Destino:</strong> {destino || 'No especificado'}</p>
          <p><strong>Fecha de salida:</strong> {fechaSalida || 'No especificada'}</p>
          <p><strong>Fecha de regreso:</strong> {fechaVuelta || 'No especificada'}</p>
          <p><strong>Personas:</strong> {personas || 'No especificado'}</p>
          {auto && (
              <p><strong>Auto:</strong> {auto.marca} - {auto.modelo}</p>
          )}
        </section>

        <section className="viajes-section">  
          <h2>Viajes de ida</h2> 
          {viajesIda.length === 0 ? (
            <p>No hay viajes de ida disponibles.</p>  
          ) : (
            <ul className="viajes-list">  
              {viajesIda.map((viaje) => (
                <li 
                  key={viaje.id} 
                  className={`viaje-card ${viajeIdaSeleccionado && viajeIdaSeleccionado.id === viaje.id ? 'seleccionado' : ''}`}  
                >
                  <p><strong>Bus:</strong> {viaje.bus || 'No especificado'}</p> 
                  <p><strong>Origen:</strong> {viaje.origen || 'No especificado'}</p>
                  <p><strong>Destino:</strong> {viaje.destino || 'No especificado'}</p>
                  <p><strong>Fecha salida:</strong> {viaje.fecha_salida ? new Date(viaje.fecha_salida).toLocaleString() : 'No especificada'}</p>
                  <p><strong>Fecha llegada:</strong> {viaje.fecha_llegada ? new Date(viaje.fecha_llegada).toLocaleString() : 'No especificada'}</p>
                  <p><strong>Precio base:</strong> {formatoPesos(viaje.precio_base)}</p>
                  <button onClick={() => handleSeleccionViajeIda(viaje)}>
                    {viajeIdaSeleccionado && viajeIdaSeleccionado.id === viaje.id ? 'Deseleccionar' : 'Seleccionar viaje de ida'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="viajes-section">
          <h2>Viajes de regreso</h2>
          {viajesVuelta.length === 0 ? (
            <p>No hay viajes de regreso disponibles.</p>  
          ) : (
            <ul className="viajes-list">
              {viajesVuelta.map((viaje) => (
                <li 
                  key={viaje.id} 
                  className={`viaje-card ${viajeVueltaSeleccionado && viajeVueltaSeleccionado.id === viaje.id ? 'seleccionado' : ''}`}  
                >
                  <p><strong>Bus:</strong> {viaje.bus || 'No especificado'}</p>  
                  <p><strong>Origen:</strong> {viaje.origen || 'No especificado'}</p>
                  <p><strong>Destino:</strong> {viaje.destino || 'No especificado'}</p>
                  <p><strong>Fecha salida:</strong> {viaje.fecha_salida ? new Date(viaje.fecha_salida).toLocaleString() : 'No especificada'}</p>
                  <p><strong>Fecha llegada:</strong> {viaje.fecha_llegada ? new Date(viaje.fecha_llegada).toLocaleString() : 'No especificada'}</p>
                  <p><strong>Precio base:</strong> {formatoPesos(viaje.precio_base)}</p>
                  <button onClick={() => handleSeleccionViajeVuelta(viaje)}>
                    {viajeVueltaSeleccionado && viajeVueltaSeleccionado.id === viaje.id ? 'Deseleccionar' : 'Seleccionar viaje de vuelta'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {viajeIdaSeleccionado && viajeVueltaSeleccionado && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleContinuarSeleccionAsientos}
            >
              Continuar a selección de asientos
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </main>
    </>
  );
}

export default ViajesDisponibles;