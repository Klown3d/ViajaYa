import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/SuccessModal';
import '../../../styles/Staff/Create.css';

const ListVuelo = () => {
  const [vuelos, setVuelos] = useState([]);
  const [vueloEditar, setVueloEditar] = useState(null);
  const [aviones, setAviones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  const cargarVuelos = () => {
    fetch('http://127.0.0.1:8000/conseguir_vuelos/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setVuelos(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los vuelos');
      });
  };

  const cargarAviones = () => {
    fetch('http://127.0.0.1:8000/conseguir_aviones/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setAviones(data))
      .catch(err => console.error('Error al cargar aviones', err));
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
    cargarVuelos();
    cargarAviones();
    cargarCiudades();
  }, []);

  const handleAsientos = (vuelo) => {
    navigate(`/staff/asientos/${vuelo.id}`, { state: { vuelo } });
  };

  const handleEditar = (vuelo) => {
    setVueloEditar({
      ...vuelo,
      fecha: new Date(vuelo.fecha).toISOString().slice(0, 16), // formato para input datetime-local
    });
  };

  const handleUpdate = () => {
    const data = {
      avion: parseInt(vueloEditar.avion),
      origen: parseInt(vueloEditar.origen),
      destino: parseInt(vueloEditar.destino),
      fecha: vueloEditar.fecha,
    };

    fetch(`http://127.0.0.1:8000/actualizar_vuelo/${vueloEditar.id}/`, {
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
          setVueloEditar(null);
          cargarVuelos();
        } else {
          return res.json().then(err => {
            console.error('Error al actualizar vuelo:', err);
            alert('Error al actualizar el vuelo');
          });
        }
      })
      .catch(err => console.error('Error al actualizar:', err));
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-calendar-week" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Vuelos
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {vuelos.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Avión (ID)</th>
                <th>Origen (ID)</th>
                <th>Destino (ID)</th>
                <th>Fecha</th>
                <th>Asientos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vuelos.map((vuelo) => (
                <tr key={vuelo.id}>
                  <td>{vuelo.id}</td>
                  <td>{vuelo.avion}</td>
                  <td>{vuelo.origen}</td>
                  <td>{vuelo.destino}</td>
                  <td>{new Date(vuelo.fecha).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleAsientos(vuelo)}>
                      <i className='bx bx-chair'></i>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditar(vuelo)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                      title="Modificar"
                    >
                      <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No hay vuelos disponibles.
          </p>
        )}
      </div>

      {vueloEditar && (
        <div className="mt-5">
          <h4>Editar Vuelo ID {vueloEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Avión</label>
              <select
                className="form-control"
                value={vueloEditar.avion}
                onChange={(e) => setVueloEditar({ ...vueloEditar, avion: e.target.value })}
              >
                <option value="">Seleccione un avión</option>
                {aviones.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} (ID {a.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Origen</label>
              <select
                className="form-control"
                value={vueloEditar.origen}
                onChange={(e) => setVueloEditar({ ...vueloEditar, origen: e.target.value })}
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
                value={vueloEditar.destino}
                onChange={(e) => setVueloEditar({ ...vueloEditar, destino: e.target.value })}
              >
                <option value="">Seleccione destino</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input
                type="datetime-local"
                className="form-control"
                value={vueloEditar.fecha}
                onChange={(e) => setVueloEditar({ ...vueloEditar, fecha: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setVueloEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Vuelo actualizado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListVuelo;
