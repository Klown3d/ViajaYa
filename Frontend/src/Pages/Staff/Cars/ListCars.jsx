import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../../styles/Staff/List.css';
import SuccessModal from '../../../components/SuccessModal.jsx';

const ListCars = () => {
  const [autos, setAutos] = useState([]);
  const [autoEditar, setAutoEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const cargarAutos = () => {
    fetch("http://127.0.0.1:8000/conseguir_autos/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener autos");
        return res.json();
      })
      .then((data) => setAutos(data))
      .catch((err) => {
        console.error(err);
        setAutos([]);
      });
  };

  useEffect(() => {
    cargarAutos();
  }, []);

  const handleEditar = (auto) => {
    setAutoEditar(auto);
  };

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:8000/actualizar_auto/${autoEditar.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(autoEditar),
    })
      .then((res) => {
        if (res.ok) {
          setShowModal(true);
          setAutoEditar(null);
          cargarAutos();
        } else {
          alert("Error al actualizar auto");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-car" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Autos
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {autos.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Color</th>
                <th>Precio x Día</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {autos.map((auto) => (
                <tr key={auto.id}>
                  <td>{auto.id}</td>
                  <td>{auto.marca}</td>
                  <td>{auto.modelo}</td>
                  <td>{auto.color}</td>
                  <td>${auto.precio_dia}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(auto)}
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
            No se encontraron autos para mostrar.
          </p>
        )}
      </div>

      {autoEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Auto ID {autoEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Marca</label>
              <input
                type="text"
                className="form-control"
                value={autoEditar.marca}
                onChange={(e) => setAutoEditar({ ...autoEditar, marca: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Modelo</label>
              <input
                type="text"
                className="form-control"
                value={autoEditar.modelo}
                onChange={(e) => setAutoEditar({ ...autoEditar, modelo: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Color</label>
              <input
                type="text"
                className="form-control"
                value={autoEditar.color}
                onChange={(e) => setAutoEditar({ ...autoEditar, color: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio por Día</label>
              <input
                type="number"
                className="form-control"
                value={autoEditar.precio_dia}
                onChange={(e) => setAutoEditar({ ...autoEditar, precio_dia: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setAutoEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Auto modificado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListCars;
