import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/SuccessModal';
import '../../../styles/Staff/Create.css';

const ListViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [viajeEditar, setViajeEditar] = useState(null);
  const [buses, setBuses] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  const cargarViajes = () => {
    fetch('http://127.0.0.1:8000/conseguir_viajes/', {  
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setViajes(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los viajes');
      });
  };

  const cargarBuses = () => {  
    fetch('http://127.0.0.1:8000/conseguir_buses/', { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setBuses(data))
      .catch(err => console.error('Error al cargar buses', err));
  };

  const cargarCiudades = () => {
    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setCiudades(data))
      .catch(err => console.error('Error al cargar ciudades', err));
  };

  useEffect(() => {
    cargarViajes();
    cargarBuses();
    cargarCiudades();
  }, []);

  const handleAsientos = (viaje) => {
    navigate(`/staff/asientos/${viaje.id}`, { state: { viaje } });  
  };

  const handleEditar = (viaje) => {
    setViajeEditar({
      ...viaje,
      fecha_salida: new Date(viaje.fecha_salida).toISOString().slice(0, 16),
      fecha_llegada: viaje.fecha_llegada ? new Date(viaje.fecha_llegada).toISOString().slice(0, 16) : '',
    });
  };

  const handleEliminar = (viajeId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      return;
    }

    fetch(`http://127.0.0.1:8000/actualizar_viaje/${viajeId}/`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.ok) {
          alert('Viaje eliminado correctamente');
          cargarViajes();
        } else {
          alert('Error al eliminar el viaje');
        }
      })
      .catch(err => console.error('Error al eliminar:', err));
  };

  const handleUpdate = () => {
    const data = {
      bus: parseInt(viajeEditar.bus),
      origen: parseInt(viajeEditar.origen),
      destino: parseInt(viajeEditar.destino),
      fecha_salida: viajeEditar.fecha_salida, 
      fecha_llegada: viajeEditar.fecha_llegada, 
      distancia_km: parseInt(viajeEditar.distancia_km) || 0,  
    };

    fetch(`http://127.0.0.1:8000/actualizar_viaje/${viajeEditar.id}/`, { 
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) {
          setShowModal(true);
          setViajeEditar(null);
          cargarViajes();
        } else {
          return res.json().then(err => {
            console.error('Error al actualizar viaje:', err);
            alert('Error al actualizar el viaje');
          });
        }
      })
      .catch(err => console.error('Error al actualizar:', err));
  };

  const handleCloseModal = () => setShowModal(false);


  const calcularDuracion = (fechaSalida, fechaLlegada) => {
    if (!fechaSalida || !fechaLlegada) return 'N/A';
    const salida = new Date(fechaSalida);
    const llegada = new Date(fechaLlegada);
    const diffMs = llegada - salida;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-calendar-week" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Viajes 
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {viajes.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Bus</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha Salida</th>
                <th>Fecha Llegada</th>
                <th>Duración</th>
                <th>Precio Base</th>
                <th>Asientos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {viajes.map((viaje) => (
                <tr key={viaje.id}>
                  <td>{viaje.id}</td>
                  <td>{viaje.bus}</td>
                  <td>{viaje.origen}</td>
                  <td>{viaje.destino}</td>
                  <td>{new Date(viaje.fecha_salida).toLocaleString()}</td>  
                  <td>{viaje.fecha_llegada ? new Date(viaje.fecha_llegada).toLocaleString() : 'N/A'}</td>
                  <td>{calcularDuracion(viaje.fecha_salida, viaje.fecha_llegada)}</td> 
                  <td>${viaje.precio_base?.toLocaleString() || '0'}</td> 
                  <td>
                    <button className="btn btn-primary" onClick={() => handleAsientos(viaje)}>
                      <i className='bx bx-chair'></i>
                    </button>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => handleEditar(viaje)}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                        title="Modificar"
                      >
                        <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                      </button>
                      <button
                        onClick={() => handleEliminar(viaje.id)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                      >
                        <i className="bx bx-trash" style={{ fontSize: "1.2rem", color: "#dc3545" }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No hay viajes disponibles. 
          </p>
        )}
      </div>

      {viajeEditar && (
        <div className="mt-5">
          <h4>Editar Viaje ID {viajeEditar.id}</h4> 
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Bus</label> 
              <select
                className="form-control"
                value={viajeEditar.bus}
                onChange={(e) => setViajeEditar({ ...viajeEditar, bus: e.target.value })}
              >
                <option value="">Seleccione un bus</option>
                {buses.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.nombre} (ID {b.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Origen</label>
              <select
                className="form-control"
                value={viajeEditar.origen}
                onChange={(e) => setViajeEditar({ ...viajeEditar, origen: e.target.value })}
              >
                <option value="">Seleccione origen</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Destino</label>
              <select
                className="form-control"
                value={viajeEditar.destino}
                onChange={(e) => setViajeEditar({ ...viajeEditar, destino: e.target.value })}
              >
                <option value="">Seleccione destino</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha Salida</label>  
              <input
                type="datetime-local"
                className="form-control"
                value={viajeEditar.fecha_salida}
                onChange={(e) => setViajeEditar({ ...viajeEditar, fecha_salida: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha Llegada</label>  
              <input
                type="datetime-local"
                className="form-control"
                value={viajeEditar.fecha_llegada}
                onChange={(e) => setViajeEditar({ ...viajeEditar, fecha_llegada: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Distancia (km)</label>  
              <input
                type="number"
                className="form-control"
                value={viajeEditar.distancia_km || ''}
                onChange={(e) => setViajeEditar({ ...viajeEditar, distancia_km: e.target.value })}
                min="1"
              />
            </div>
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setViajeEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Viaje actualizado correctamente!"  
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListViajes;  