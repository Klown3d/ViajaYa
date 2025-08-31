import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateCiudad = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/staff/ciudad/crear');
  };
  const [form, setForm] = useState({
    nombre: '',
    pais: '',
    latitud: '',
    longitud: '',
  });

  const [paises, setPaises] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ⏳ Estado de carga
  const [errors, setErrors] = useState({
    latitud: '',
    longitud: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(err => console.error('Error al cargar países:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCoordinates = () => {
    let valid = true;
    let newErrors = { latitud: '', longitud: '' };

    const lat = parseFloat(form.latitud);
    const lon = parseFloat(form.longitud);

    // Validación de latitud
    if (lat < -90 || lat > 90) {
      newErrors.latitud = 'La latitud debe estar entre -90 y 90 grados.';
      valid = false;
    } else {
      // Asegurarse de que la latitud tiene 6 decimales
      form.latitud = lat.toFixed(6);
    }

    // Validación de longitud
    if (lon < -180 || lon > 180) {
      newErrors.longitud = 'La longitud debe estar entre -180 y 180 grados.';
      valid = false;
    } else {
      // Asegurarse de que la longitud tiene 6 decimales
      form.longitud = lon.toFixed(6);
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateCoordinates()) {
      return; // Si las coordenadas son inválidas, no enviar el formulario
    }

    const token = localStorage.getItem('access');
    setIsLoading(true); // ⏳ Activar loading

    fetch('http://127.0.0.1:8000/crear_ciudad/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        setIsLoading(false); // ✅ Finalizar loading
        if (res.status === 201) {
          setShowModal(true)
          setForm({
            nombre: '',
            pais: '',
            latitud: '',
            longitud: ''
          });
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear ciudad');
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('Error al enviar datos:', err);
        alert('Ocurrió un error al enviar los datos');
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">Agregar Ciudad</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="create-label">País</label>
          <select
            className="form-control"
            name="pais"
            value={form.pais}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar país</option>
            {paises.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="create-label">Latitud (Formato: -34.603722)</label>
          <input
            className={`form-control ${errors.latitud ? 'is-invalid' : ''}`}
            type="number"
            step="0.000001"
            name="latitud"
            value={form.latitud}
            onChange={handleChange}
            placeholder="-34.603722"
            required
          />
          {errors.latitud && <div className="invalid-feedback">{errors.latitud}</div>}
        </div>

        <div className="mb-4">
          <label className="create-label">Longitud (Formato -58.381592)</label>
          <input
            className={`form-control ${errors.longitud ? 'is-invalid' : ''}`}
            type="number"
            step="0.000001"
            name="longitud"
            value={form.longitud}
            onChange={handleChange}
            placeholder="-58.381592"
            required
          />
          {errors.longitud && <div className="invalid-feedback">{errors.longitud}</div>}
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
      </form>
          {showModal && (
            <SuccessModal
            message="¡Cuidad agregada correctamente!"
            onClose={handleCloseModal}
            />
          )}
    </div>
  );
};

export default CreateCiudad;
