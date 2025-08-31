import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/List.css';
import SuccessModal from '../../../components/SuccessModal.jsx';

const ListCiudad = () => {
  const [ciudades, setCiudades] = useState([]);
  const [paises, setPaises] = useState([]);
  const [ciudadEditar, setCiudadEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  const cargarCiudades = () => {
    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar ciudades');
        return res.json();
      })
      .then(data => setCiudades(data))
      .catch(err => {
        console.error('Error al cargar ciudades:', err);
        alert('No se pudieron cargar las ciudades');
      });
  };

  const cargarPaises = () => {
    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar países');
        return res.json();
      })
      .then(data => setPaises(data))
      .catch(err => {
        console.error('Error al cargar países:', err);
        alert('No se pudieron cargar los países');
      });
  };

  useEffect(() => {
    cargarCiudades();
    cargarPaises();
  }, []);

  const handleEditar = (ciudad) => {
    setCiudadEditar({
      ...ciudad,
      pais: ciudad.pais_id || ciudad.pais || '',
    });
  };

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:8000/actualizar_ciudad/${ciudadEditar.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: ciudadEditar.nombre,
        pais: ciudadEditar.pais,
      }),
    })
      .then(res => {
        if (res.ok) {
          setShowModal(true);
          setCiudadEditar(null);
          cargarCiudades();
        } else {
          alert('Error al actualizar ciudad');
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
        <i className="bx bx-buildings" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Ciudades
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {ciudades.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ciudades.map((ciudad) => (
                <tr key={ciudad.id}>
                  <td>{ciudad.id}</td>
                  <td>{ciudad.nombre}</td>
                  <td>{ciudad.pais_nombre || '—'}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(ciudad)}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                        title="Modificar"
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
            No hay ciudades disponibles.
          </p>
        )}
      </div>

      {ciudadEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Ciudad ID {ciudadEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre de la Ciudad</label>
              <input
                type="text"
                className="form-control"
                value={ciudadEditar.nombre}
                onChange={(e) => setCiudadEditar({ ...ciudadEditar, nombre: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">País</label>
              <select
                className="form-select"
                value={ciudadEditar.pais}
                onChange={(e) => setCiudadEditar({ ...ciudadEditar, pais: parseInt(e.target.value) })}
                required
              >
                <option value="">Seleccionar país</option>
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setCiudadEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Ciudad modificada correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListCiudad;
