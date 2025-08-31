import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateHotels = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    pais: '',
    ciudad: '',
    descripcion: '',
    personas: 1,
    precio_noche: '',
    direccion: ''
  });

  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('access');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(err => console.error('Error al cargar países:', err));

    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setCiudades(data))
      .catch(err => console.error('Error al cargar ciudades:', err));
  }, []);

  useEffect(() => {
    if (form.pais) {
      const filtradas = ciudades.filter(c => c.pais === parseInt(form.pais));
      setCiudadesFiltradas(filtradas);
    } else {
      setCiudadesFiltradas([]);
    }
    setForm(prev => ({ ...prev, ciudad: '' })); // Resetear ciudad si cambia país
  }, [form.pais, ciudades]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('http://127.0.0.1:8000/crear_hotel/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...form, ciudad: parseInt(form.ciudad) })
    })
      .then(res => {
        setIsLoading(false);
        if (res.status === 201) {
          setShowModal(true);
          setForm({
            nombre: '',
            pais: '',
            ciudad: '',
            descripcion: '',
            personas: 1,
            precio_noche: '',
            direccion: ''
          });
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear hotel');
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('Error al enviar datos:', err);
        alert('Ocurrió un error al enviar los datos');
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/staff/hoteles/agregar');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">Agregar Hoteles</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="create-label">País</label>
          <select
            className="form-control"
            name="pais"
            value={form.pais}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar país</option>
            {paises.map(pais => (
              <option key={pais.id} value={pais.id}>
                {pais.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Ciudad</label>
          <select
            className="form-control"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar ciudad</option>
            {ciudadesFiltradas.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="create-label">Capacidad (personas)</label>
          <input type="number" className="form-control" name="personas" value={form.personas} onChange={handleChange} min="1" required />
        </div>

        <div className="mb-3">
          <label className="create-label">Precio por noche</label>
          <input type="number" className="form-control" name="precio_noche" value={form.precio_noche} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="create-label">Dirección</label>
          <input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          <div className="create-button">
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar +'
            )}
          </div>
        </button>

        {showModal && (
          <SuccessModal
            message="¡Hotel agregado correctamente!"
            onClose={handleCloseModal}
          />
        )}
      </form>
    </div>
  );
};

export default CreateHotels;
