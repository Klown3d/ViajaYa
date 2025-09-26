import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/SuccessModal.jsx';
import '../../../styles/Staff/List.css';

const ListBuses = () => {
  const [buses, setBuses] = useState([]);
  const [busEditar, setBusEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('access');

  const cargarBuses = () => {
    fetch('http://127.0.0.1:8000/conseguir_buses/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar buses');
        return res.json();
      })
      .then(data => setBuses(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los buses');
      });
  };

  useEffect(() => {
    cargarBuses();
  }, []);

  const handleEditar = (bus) => {
    setBusEditar(bus);
  };

  const handleEliminar = (busId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este bus?')) {
      return;
    }

    fetch(`http://127.0.0.1:8000/actualizar_bus/${busId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.ok) {
          alert('Bus eliminado correctamente');
          cargarBuses();
        } else {
          alert('Error al eliminar el bus');
        }
      })
      .catch(err => console.error('Error al eliminar:', err));
  };

  const handleUpdate = () => {
    const asientos_vip = Number(busEditar.asientos_vip || 0);
    const asientos_general = Number(busEditar.asientos_general || 0);
    const capacidad_total = asientos_vip + asientos_general;

    const busActualizado = {
      ...busEditar,
      capacidad_bus: capacidad_total,
    };

    fetch(`http://127.0.0.1:8000/actualizar_bus/${busEditar.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(busActualizado),
    })
      .then(res => {
        if (res.ok) {
          setShowModal(true);
          setBusEditar(null);
          cargarBuses();
        } else {
          alert('Error al actualizar el bus');
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
        <i className="bx bx-bus" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Buses
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {buses.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Capacidad Total</th>
                <th>Asientos VIP</th>
                <th>Asientos General</th>
                <th>Costo por km</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.id}</td>
                  <td>{bus.nombre}</td>
                  <td>{bus.capacidad_bus}</td>
                  <td>{bus.asientos_vip}</td>
                  <td>{bus.asientos_general}</td>
                  <td>${bus.costo_km}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                        title="Modificar"
                        onClick={() => handleEditar(bus)}
                      >
                        <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                        onClick={() => handleEliminar(bus.id)}
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
            No hay buses disponibles.
          </p>
        )}
      </div>

      {busEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Bus ID {busEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre del Bus</label>
              <input
                type="text"
                className="form-control"
                value={busEditar.nombre}
                onChange={(e) => setBusEditar({ ...busEditar, nombre: e.target.value })}
                placeholder="Ej: Bus Ejecutivo 500"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Costo por kilómetro ($)</label>
              <input
                type="number"
                className="form-control"
                value={busEditar.costo_km}
                onChange={(e) => setBusEditar({ ...busEditar, costo_km: e.target.value })}
                min="1"
              />
            </div>

       
            <div className="mb-3">
              <label className="form-label">Capacidad Total Calculada</label>
              <input
                type="number"
                className="form-control"
                value={
                  Number(busEditar.asientos_vip || 0) +
                  Number(busEditar.asientos_general || 0)
                }
                readOnly
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Asientos VIP</label>
              <input
                type="number"
                className="form-control"
                value={busEditar.asientos_vip}
                onChange={(e) => setBusEditar({ ...busEditar, asientos_vip: e.target.value })}
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Asientos General</label>
              <input
                type="number"
                className="form-control"
                value={busEditar.asientos_general}
                onChange={(e) => setBusEditar({ ...busEditar, asientos_general: e.target.value })}
                min="0"
              />
            </div>

            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setBusEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Bus modificado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListBuses;