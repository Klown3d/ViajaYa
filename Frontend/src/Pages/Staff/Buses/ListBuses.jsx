import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/SuccessModal.jsx';
import '../../../styles/Staff/List.css';

const ListAviones = () => {
  const [aviones, setAviones] = useState([]);
  const [avionEditar, setAvionEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('access');

  const cargarAviones = () => {
    fetch('http://127.0.0.1:8000/conseguir_aviones/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar aviones');
        return res.json();
      })
      .then(data => setAviones(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los aviones');
      });
  };

  useEffect(() => {
    cargarAviones();
  }, []);

  const handleEditar = (avion) => {
    setAvionEditar(avion);
  };

  const handleUpdate = () => {
    const capacidad_vip = Number(avionEditar.capacidad_vip || 0);
    const capacidad_general = Number(avionEditar.capacidad_general || 0);
    const capacidad_total = capacidad_vip + capacidad_general;

    const avionActualizado = {
      ...avionEditar,
      capacidad_avion: capacidad_total,
    };

    fetch(`http://127.0.0.1:8000/actualizar_avion/${avionEditar.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(avionActualizado),
    })
      .then(res => {
        if (res.ok) {
          setShowModal(true);
          setAvionEditar(null);
          cargarAviones();
        } else {
          alert('Error al actualizar el avión');
        }
      })
      .catch(err => console.error('Error al actualizar:', err));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-paper-plane" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Aviones
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {aviones.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Capacidad Total</th>
                <th>VIP</th>
                <th>General</th>
                <th>Costo x km (VIP)</th>
                <th>Costo x km (General)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {aviones.map((avion) => (
                <tr key={avion.id}>
                  <td>{avion.id}</td>
                  <td>{avion.nombre}</td>
                  <td>{avion.capacidad_avion}</td>
                  <td>{avion.capacidad_vip}</td>
                  <td>{avion.capacidad_general}</td>
                  <td>${avion.costo_km_vip}</td>
                  <td>${avion.costo_km_general}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                        title="Modificar"
                        onClick={() => handleEditar(avion)}
                      >
                        <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No hay aviones disponibles.
          </p>
        )}
      </div>

      {avionEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Avión ID {avionEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={avionEditar.nombre}
                onChange={(e) => setAvionEditar({ ...avionEditar, nombre: e.target.value })}
              />
            </div>

            {/* Capacidad Total solo lectura */}
            <div className="mb-3">
              <label className="form-label">Capacidad Total</label>
              <input
                type="number"
                className="form-control"
                value={
                  Number(avionEditar.capacidad_vip || 0) +
                  Number(avionEditar.capacidad_general || 0)
                }
                readOnly
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Capacidad VIP</label>
              <input
                type="number"
                className="form-control"
                value={avionEditar.capacidad_vip}
                onChange={(e) => setAvionEditar({ ...avionEditar, capacidad_vip: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Capacidad General</label>
              <input
                type="number"
                className="form-control"
                value={avionEditar.capacidad_general}
                onChange={(e) => setAvionEditar({ ...avionEditar, capacidad_general: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Costo por km (VIP)</label>
              <input
                type="number"
                className="form-control"
                value={avionEditar.costo_km_vip}
                onChange={(e) => setAvionEditar({ ...avionEditar, costo_km_vip: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Costo por km (General)</label>
              <input
                type="number"
                className="form-control"
                value={avionEditar.costo_km_general}
                onChange={(e) => setAvionEditar({ ...avionEditar, costo_km_general: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setAvionEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Avión modificado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListAviones;
