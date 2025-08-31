import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal.jsx';

const ListPais = () => {
  const [paises, setPaises] = useState([]);
  const [paisEditar, setPaisEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // ← ✅

  const cargarPaises = () => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar países');
        return res.json();
      })
      .then(data => setPaises(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los países');
      });
  };

  useEffect(() => {
    cargarPaises();
  }, []);

  const handleEditar = (pais) => {
    setPaisEditar(pais);
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('access');

    fetch(`http://127.0.0.1:8000/actualizar_pais/${paisEditar.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paisEditar),
    })
      .then(res => {
        if (res.ok) {
          setShowModal(true);
          setPaisEditar(null);
          cargarPaises();
        } else {
          alert('Error al actualizar país');
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
        <i className="bx bx-flag" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Países
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {paises.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paises.map((pais) => (
                <tr key={pais.id}>
                  <td>{pais.id}</td>
                  <td>{pais.nombre}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(pais)}
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
            No hay países disponibles.
          </p>
        )}
      </div>

      {paisEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar País ID {paisEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre del País</label>
              <input
                type="text"
                className="form-control"
                value={paisEditar.nombre}
                onChange={(e) => setPaisEditar({ ...paisEditar, nombre: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setPaisEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡País modificado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListPais;
