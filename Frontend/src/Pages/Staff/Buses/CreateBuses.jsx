import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateAviones = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  
    const handleSuccess = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      navigate('/staff/aviones/crear');
    };

  const [form, setForm] = useState({
    nombre: '',
    costo_km_general: '',
    costo_km_vip: '',
    capacidad_vip: '',
    capacidad_general: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    setIsLoading(true);

    fetch('http://127.0.0.1:8000/crear_avion/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        setIsLoading(false);
        if (res.status === 201) {
          setShowModal(true)
          setForm({
            nombre: '',
            costo_km_general: '',
            costo_km_vip: '',
            capacidad_vip: '',
            capacidad_general: '',
          })

        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear avión');
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
      <h2 className="mb-4 text-center create-title">Agregar Avión</h2>
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

        <div className="mb-3">
          <label className="create-label">Costo por km (General)</label>
          <input
            type="number"
            className="form-control"
            name="costo_km_general"
            value={form.costo_km_general}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Costo por km (VIP)</label>
          <input
            type="number"
            className="form-control"
            name="costo_km_vip"
            value={form.costo_km_vip}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Capacidad VIP</label>
          <input
            type="number"
            className="form-control"
            name="capacidad_vip"
            value={form.capacidad_vip}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Capacidad General</label>
          <input
            type="number"
            className="form-control"
            name="capacidad_general"
            value={form.capacidad_general}
            onChange={handleChange}
            required
          />
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
              message="¡Avion agregado correctamente!"
              onClose={handleCloseModal}
            />
          )}
    </div>
  );
};

export default CreateAviones;
