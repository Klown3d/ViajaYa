import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/SuccessModal.jsx';

const ListHotels = () => {
  const [hoteles, setHoteles] = useState([]);
  const [hotelEditar, setHotelEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('access');

  const cargarHoteles = () => {
    fetch('http://127.0.0.1:8000/conseguir_hoteles/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener hoteles');
        return res.json();
      })
      .then((data) => setHoteles(data))
      .catch((err) => {
        console.error(err);
        setHoteles([]);
      });
  };

  useEffect(() => {
    cargarHoteles();

    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setPaises(data))
      .catch((err) => console.error('Error al cargar países:', err));

    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setCiudades(data))
      .catch((err) => console.error('Error al cargar ciudades:', err));
  }, []);

  useEffect(() => {
    if (hotelEditar?.pais) {
      const filtradas = ciudades.filter(
        (c) => c.pais === parseInt(hotelEditar.pais)
      );
      setCiudadesFiltradas(filtradas);
    }
  }, [hotelEditar?.pais, ciudades]);

  const handleEditar = (hotel) => {
    setHotelEditar({
      ...hotel,
      pais: hotel.pais_id || '', // aseguramos compatibilidad con el backend
      ciudad: hotel.ciudad_id || ''
    });
  };

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:8000/actualizar_hotel/${hotelEditar.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...hotelEditar,
        ciudad: parseInt(hotelEditar.ciudad),
        pais: parseInt(hotelEditar.pais)
      }),
    })
      .then((res) => {
        if (res.ok) {
          setShowModal(true);
          setHotelEditar(null);
          cargarHoteles();
        } else {
          alert('Error al actualizar hotel');
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
        <i className="bx bx-hotel" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Hoteles
      </div>

      {/* Tabla de hoteles */}
      <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {hoteles.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Dirección</th>
                <th>Precio</th>
                <th>Personas</th>
                <th>Ciudad</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hoteles.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td>{hotel.nombre}</td>
                  <td>{hotel.descripcion}</td>
                  <td>{hotel.direccion}</td>
                  <td>${hotel.precio_noche}</td>
                  <td>{hotel.personas}</td>
                  <td>{hotel.ciudad_nombre}</td>
                  <td>{hotel.pais_nombre}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(hotel)}
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
          <p className="text-center fw-bold" style={{ color: '#0d6efd' }}>
            No se encontraron hoteles para mostrar.
          </p>
        )}
      </div>

      {/* Formulario de edición */}
      {hotelEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Hotel ID {hotelEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={hotelEditar.nombre}
                onChange={(e) => setHotelEditar({ ...hotelEditar, nombre: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={hotelEditar.descripcion}
                onChange={(e) => setHotelEditar({ ...hotelEditar, descripcion: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={hotelEditar.direccion}
                onChange={(e) => setHotelEditar({ ...hotelEditar, direccion: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Precio por Noche</label>
              <input
                type="number"
                className="form-control"
                value={hotelEditar.precio_noche}
                onChange={(e) => setHotelEditar({ ...hotelEditar, precio_noche: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Personas</label>
              <input
                type="number"
                className="form-control"
                value={hotelEditar.personas}
                onChange={(e) => setHotelEditar({ ...hotelEditar, personas: e.target.value })}
                required
              />
            </div>

            {/* País */}
            <div className="mb-3">
              <label className="form-label">País</label>
              <select
                className="form-control"
                value={hotelEditar.pais}
                onChange={(e) => {
                  const nuevoPais = e.target.value;
                  setHotelEditar({ ...hotelEditar, pais: nuevoPais, ciudad: '' });
                }}
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

            {/* Ciudad */}
            <div className="mb-3">
              <label className="form-label">Ciudad</label>
              <select
                className="form-control"
                value={hotelEditar.ciudad}
                onChange={(e) => setHotelEditar({ ...hotelEditar, ciudad: e.target.value })}
                required
              >
                <option value="">Seleccionar ciudad</option>
                {ciudadesFiltradas.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setHotelEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Hotel modificado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListHotels;
