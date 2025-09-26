import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateViajes = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bus: '',         
    origen: '',
    destino: '',
    fecha_salida: '',  
    fecha_llegada: '' 
  });

  const [showModal, setShowModal] = useState(false);
  const [buses, setBuses] = useState([]);        
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');


    fetch('http://127.0.0.1:8000/conseguir_buses/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBuses(data))
      .catch(err => console.error("Error cargando buses:", err));

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

  const validateForm = () => {
    if (form.origen === form.destino) {
      setError('El origen y el destino no pueden ser la misma ciudad');
      return false;
    }

    if (form.fecha_salida && form.fecha_llegada) {
      const salida = new Date(form.fecha_salida);
      const llegada = new Date(form.fecha_llegada);
      
      if (llegada <= salida) {
        setError('La fecha de llegada debe ser posterior a la fecha de salida');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('access');
    setLoading(true);

  
    fetch('http://127.0.0.1:8000/crear_viaje/', {
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
          setShowModal(true);
          setForm({
            bus: '',
            origen: '',
            destino: '',
            fecha_salida: '',
            fecha_llegada: ''
          });
        } else {
          return res.json().then(data => {
            setError(data.error || 'Error al crear el viaje');
            console.error(data);
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setError('Ocurrió un error al crear el viaje');
        console.error(err);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">🚌 Agregar Viaje</h2>  
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Bus</label>  
          <select className="form-control" name="bus" value={form.bus} onChange={handleChange} required>
            <option value="">Seleccionar bus</option>
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>{bus.nombre} - Capacidad: {bus.capacidad_bus}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Origen</label>
          <select className="form-control" name="origen" value={form.origen} onChange={handleChange} required>
            <option value="">Seleccionar ciudad de origen</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}, {ciudad.pais_nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Destino</label>
          <select className="form-control" name="destino" value={form.destino} onChange={handleChange} required>
            <option value="">Seleccionar ciudad de destino</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}, {ciudad.pais_nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Fecha y hora de salida</label>  
          <input
            type="datetime-local"
            className="form-control"
            name="fecha_salida"
            value={form.fecha_salida}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="create-label">Fecha y hora de llegada</label>  
          <input
            type="datetime-local"
            className="form-control"
            name="fecha_llegada"
            value={form.fecha_llegada}
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
              'Crear Viaje'  
            )}
          </div>
        </button>
      </form>
      
      {showModal && (
        <SuccessModal
          message="¡Viaje agregado correctamente!" 
          onClose={() => {
            setShowModal(false);
            navigate('/staff/viajes/crear');  
          }}
        />
      )}
    </div>
  );
};

export default CreateViajes;  {/* Nombre del componente cambiado */}