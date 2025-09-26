import React, { useEffect, useState } from "react";
import SuccessModal from "../../../components/SuccessModal.jsx";

const ListPacks = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [paqueteEditar, setPaqueteEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [viajes, setViajes] = useState([]); 
  const [autos, setAutos] = useState([]);
  const [hoteles, setHoteles] = useState([]);

  const token = localStorage.getItem("access");

  const cargarPaquetes = () => {
    fetch("http://127.0.0.1:8000/conseguir_paquetes_lista/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPaquetes(data))
      .catch((err) => {
        console.error(err);
        setPaquetes([]);
      });
  };

  const cargarViajes = () => { 
    fetch("http://127.0.0.1:8000/conseguir_viajes/", { 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setViajes(data))
      .catch((err) => console.error("Error al cargar viajes", err));
  };

  const cargarAutos = () => {
    fetch("http://127.0.0.1:8000/conseguir_autos/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAutos(data))
      .catch((err) => console.error("Error al cargar autos", err));
  };

  const cargarHoteles = () => {
    fetch("http://127.0.0.1:8000/conseguir_hoteles/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setHoteles(data))
      .catch((err) => console.error("Error al cargar hoteles", err));
  };

  useEffect(() => {
    cargarPaquetes();
    cargarViajes();
    cargarAutos();
    cargarHoteles();
  }, []);

  const handleEditar = (paquete) => {
    setPaqueteEditar({
      ...paquete,
      viaje_ida: paquete.viaje_ida || '', 
      viaje_vuelta: paquete.viaje_vuelta || '', 
      auto: paquete.auto || '',
      hotel: paquete.hotel || '',
      total: paquete.total || 0,
    });
  };

  const handleUpdate = () => {
    const data = {
      descripcion: paqueteEditar.descripcion,
      personas: parseInt(paqueteEditar.personas),
      viaje_ida: parseInt(paqueteEditar.viaje_ida),
      viaje_vuelta: parseInt(paqueteEditar.viaje_vuelta), 
      auto: parseInt(paqueteEditar.auto),
      hotel: parseInt(paqueteEditar.hotel),
      total: parseFloat(paqueteEditar.total),
    };

    fetch(`http://127.0.0.1:8000/actualizar_paquete/${paqueteEditar.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          setShowModal(true);
          setPaqueteEditar(null);
          cargarPaquetes();
        } else {
          return res.json().then(err => {
            console.error("Detalles del error:", err);
            alert("Error al actualizar el paquete.");
          });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error de conexión al actualizar el paquete.");
      });
  };

  const handleCloseModal = () => setShowModal(false);


  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    return new Date(fechaISO).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-package" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Paquetes
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {paquetes.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Personas</th>
                <th>Viaje Ida</th> 
                <th>Viaje Vuelta</th> 
                <th>Auto</th>
                <th>Hotel</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.map((pack) => (
                <tr key={pack.id}>
                  <td>{pack.id}</td>
                  <td>{pack.descripcion}</td>
                  <td>{pack.personas}</td>
                  <td>
                    {formatFecha(pack.viaje_ida_obj?.fecha_salida)}{" "} 
                    | <b>{pack.viaje_ida_obj?.origen_nombre || "—"}</b> a <b>{pack.viaje_ida_obj?.destino_nombre || "—"}</b>
                    {pack.viaje_ida_obj?.bus && <div><small>Bus: {pack.viaje_ida_obj.bus}</small></div>} 
                  </td>

                  <td>
                    {formatFecha(pack.viaje_vuelta_obj?.fecha_salida)}{" "}
                    | <b>{pack.viaje_vuelta_obj?.origen_nombre || "—"}</b> a <b>{pack.viaje_vuelta_obj?.destino_nombre || "—"}</b>
                    {pack.viaje_vuelta_obj?.bus && <div><small>Bus: {pack.viaje_vuelta_obj.bus}</small></div>}
                  </td>

                  <td>{pack.auto || "—"}</td>
                  <td>{pack.hotel || "—"}</td>
                  <td>
                    {pack.total?.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                    }) || "—"}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(pack)}
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
            No se encontraron paquetes para mostrar.
          </p>
        )}
      </div>

      {paqueteEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Paquete ID {paqueteEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                className="form-control"
                value={paqueteEditar.descripcion}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, descripcion: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Personas</label>
              <input
                type="number"
                className="form-control"
                value={paqueteEditar.personas}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, personas: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Viaje Ida</label> 
              <select
                className="form-control"
                value={paqueteEditar.viaje_ida} 
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, viaje_ida: e.target.value })}
              >
                <option value="">Seleccione un viaje</option> 
                {viajes.map(v => (
                  <option key={v.id} value={v.id}>
                    ID {v.id} - {v.origen} ➝ {v.destino} (Bus: {v.bus})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Viaje Vuelta</label> 
              <select
                className="form-control"
                value={paqueteEditar.viaje_vuelta} 
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, viaje_vuelta: e.target.value })}
              >
                <option value="">Seleccione un viaje</option> 
                {viajes.map(v => (
                  <option key={v.id} value={v.id}>
                    ID {v.id} - {v.origen} ➝ {v.destino} (Bus: {v.bus}) 
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Auto</label>
              <select
                className="form-control"
                value={paqueteEditar.auto}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, auto: e.target.value })}
              >
                <option value="">Seleccione un auto</option>
                {autos.map(a => (
                  <option key={a.id} value={a.id}>{a.marca} {a.modelo}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Hotel</label>
              <select
                className="form-control"
                value={paqueteEditar.hotel}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, hotel: e.target.value })}
              >
                <option value="">Seleccione un hotel</option>
                {hoteles.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Total</label>
              <input
                type="number"
                className="form-control"
                value={paqueteEditar.total}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, total: e.target.value })}
                step="0.01"
              />
            </div>

            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setPaqueteEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Paquete actualizado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListPacks;