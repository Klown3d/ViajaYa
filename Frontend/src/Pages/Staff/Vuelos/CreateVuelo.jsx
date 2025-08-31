import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateVuelo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    avion: '',
    origen: '',
    destino: '',
    fecha: '',
  });

  const [showModal, setShowModal] = useState(false);
    
    const handleSuccess = () => {
      setShowModal(true);
    };
    
    const handleCloseModal = () => {
      setShowModal(false);
      navigate('/staff/Vuelos/crear');
    };
  const [aviones, setAviones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_aviones/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAviones(data))
      .catch(err => console.error("Error cargando aviones:", err));

    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCiudades(data))
      .catch(err => console.error("Error cargando ciudades:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    setLoading(true);

    fetch('http://127.0.0.1:8000/crear_vuelo/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        setLoading(false);
        if (res.status === 201) {
          setShowModal(true)
          setForm({
            avion: '',
            origen: '',
            destino: '',
            fecha: '',
          })
        } else {
          return res.json().then(data => {
            alert('Error al crear vuelo');
            console.error(data);
          });
        }
      })
      .catch(err => {
        setLoading(false);
        alert('Ocurrió un error al crear el vuelo');
        console.error(err);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">Agregar Vuelo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Avión</label>
          <select className="form-control" name="avion" value={form.avion} onChange={handleChange} required>
            <option value="">Seleccionar avión</option>
            {aviones.map(avion => (
              <option key={avion.id} value={avion.id}>{avion.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Origen</label>
          <select className="form-control" name="origen" value={form.origen} onChange={handleChange} required>
            <option value="">Seleccionar ciudad de origen</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Destino</label>
          <select className="form-control" name="destino" value={form.destino} onChange={handleChange} required>
            <option value="">Seleccionar ciudad de destino</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="create-label">Fecha y hora</label>
          <input
            type="datetime-local"
            className="form-control"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          <div className="create-button">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar +'
            )}
          </div>
        </button>
      </form>
          {showModal && (
            <SuccessModal
              message="¡Vuelo agregado correctamente!"
              onClose={handleCloseModal}
            />
          )}
    </div>
  );
};

export default CreateVuelo;
