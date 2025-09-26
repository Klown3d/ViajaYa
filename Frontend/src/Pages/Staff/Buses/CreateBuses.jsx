import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateBuses = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  
  const handleSuccess = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/staff/buses/crear');
  };

  const [form, setForm] = useState({
    nombre: '',
    costo_km: '',  
    asientos_vip: '', 
    asientos_general: '',  
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


    const asientosVip = parseInt(form.asientos_vip) || 0;
    const asientosGeneral = parseInt(form.asientos_general) || 0;
    
    if (asientosVip < 0 || asientosGeneral < 0) {
      alert('El número de asientos no puede ser negativo');
      setIsLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/crear_bus/', {  
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
          setShowModal(true);
          setForm({
            nombre: '',
            costo_km: '',
            asientos_vip: '',
            asientos_general: '',
          });
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear bus: ' + (data.error || 'Verifique los datos'));
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('Error al enviar datos:', err);
        alert('Ocurrió un error al enviar los datos');
      });
  };


  const capacidadTotal = (parseInt(form.asientos_vip) || 0) + (parseInt(form.asientos_general) || 0);

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">🚌 Agregar Bus</h2>  
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Nombre del Bus</label> 
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Bus Ejecutivo 500"
            required
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Costo por kilómetro ($)</label>  
          <input
            type="number"
            className="form-control"
            name="costo_km"
            value={form.costo_km}
            onChange={handleChange}
            placeholder="Ej: 1000"
            min="1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Asientos VIP</label> 
          <input
            type="number"
            className="form-control"
            name="asientos_vip"
            value={form.asientos_vip}
            onChange={handleChange}
            placeholder="Ej: 10"
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Asientos General</label>  
          <input
            type="number"
            className="form-control"
            name="asientos_general"
            value={form.asientos_general}
            onChange={handleChange}
            placeholder="Ej: 40"
            min="0"
            required
          />
        </div>

   
        <div className="mb-3">
          <label className="create-label">Capacidad Total Calculada</label>
          <input
            type="text"
            className="form-control"
            value={`${capacidadTotal} asientos`}
            disabled
            style={{backgroundColor: '#f8f9fa', color: '#495057'}}
          />
          <small className="text-muted">
            VIP: {form.asientos_vip || 0} + General: {form.asientos_general || 0} = Total: {capacidadTotal}
          </small>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          <div className="create-button">
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar Bus' 
            )}
          </div>
        </button>
      </form>
      
      {showModal && (
        <SuccessModal
          message="¡Bus agregado correctamente!" 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CreateBuses;  