import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreatePacks = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descripcion: '',
    personas: 1,
    viaje_ida: '',  // Cambiado de vuelo_ida
    viaje_vuelta: '',  // Cambiado de vuelo_vuelta
    hotel: '',
    auto: '',
    total: 0,
  });

  const [showModal, setShowModal] = useState(false);
    
  const handleSuccess = () => {
    setShowModal(true);
  };
    
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/staff/paquetes/crear');
  };

  const [viajes, setViajes] = useState([]);  // Cambiado de vuelos
  const [autos, setAutos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const fetchData = async () => {
      try {
        const [viajesRes, autosRes, hotelesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/conseguir_viajes/', { headers }),  // Cambiado endpoint
          fetch('http://127.0.0.1:8000/conseguir_autos/', { headers }),
          fetch('http://127.0.0.1:8000/conseguir_hoteles/', { headers }),
        ]);

        const [viajesData, autosData, hotelesData] = await Promise.all([
          viajesRes.json(),
          autosRes.json(),
          hotelesRes.json()
        ]);

        setViajes(viajesData);
        setAutos(autosData);
        setHoteles(hotelesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;

    if (['personas', 'total', 'viaje_ida', 'viaje_vuelta', 'auto', 'hotel'].includes(name)) {
      parsedValue = value === '' ? '' : parseInt(value);
    }

    setForm(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    setIsLoading(true);

    fetch('http://127.0.0.1:8000/admin_crear_paquete/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        setIsLoading(false);
        if (res.status === 201) {
          setShowModal(true)
          setForm({
            descripcion: '',
            personas: 1,
            viaje_ida: '',  
            viaje_vuelta: '', 
            hotel: '',
            auto: '',
            total: 0,
          })
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear paquete: ' + (data.error || 'Verifique los datos'));
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('Error al enviar datos:', err);
        alert('Ocurrió un error al enviar los datos');
      });
  };

  
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return 'Fecha no disponible';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">🚌 Crear Paquete de Viaje</h2>  
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Descripción del Paquete</label> 
          <textarea 
            className="form-control" 
            name="descripcion" 
            value={form.descripcion} 
            onChange={handleChange}
            placeholder="Ej: Paquete familiar a la montaña"
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Cantidad de personas</label>
          <input 
            type="number" 
            className="form-control" 
            name="personas" 
            value={form.personas} 
            onChange={handleChange} 
            min="1" 
            max="50"
            required 
          />
        </div>

        <div className="mb-3">
          <label className="create-label">Viaje de ida</label>  
          <select className="form-control" name="viaje_ida" value={form.viaje_ida} onChange={handleChange} required>
            <option value="">Seleccionar viaje de ida</option>  
            {viajes.map(viaje => (
              <option key={viaje.id} value={viaje.id}>
                🚌 {viaje.bus} - {formatFecha(viaje.fecha_salida)} - {viaje.origen} → {viaje.destino}  {/* Información actualizada */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Viaje de vuelta</label>  
          <select className="form-control" name="viaje_vuelta" value={form.viaje_vuelta} onChange={handleChange} required>
            <option value="">Seleccionar viaje de vuelta</option>  
            {viajes
              .filter(viaje => {
                if (!form.viaje_ida) return true;

                const viajeIdaSeleccionado = viajes.find(v => v.id === form.viaje_ida);
                if (!viajeIdaSeleccionado) return false;

                const fechaIda = new Date(viajeIdaSeleccionado.fecha_salida);
                const fechaVuelta = new Date(viaje.fecha_salida);

                const mismoDestinoOrigen = viaje.destino === viajeIdaSeleccionado.origen;

                return fechaVuelta >= fechaIda && mismoDestinoOrigen;
              })
              .map(viaje => (
                <option key={viaje.id} value={viaje.id}>
                  🚌 {viaje.bus} - {formatFecha(viaje.fecha_salida)} - {viaje.origen} → {viaje.destino}  
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Auto (opcional)</label>
          <select className="form-control" name="auto" value={form.auto} onChange={handleChange}>
            <option value="">Ninguno</option>
            {autos.map(auto => (
              <option key={auto.id} value={auto.id}>
                🚗 {auto.marca} {auto.modelo} - ${auto.precio_dia}/día 
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Hotel (opcional)</label>
          <select className="form-control" name="hotel" value={form.hotel} onChange={handleChange}>
            <option value="">Ninguno</option>
            {hoteles
              .filter(hotel => {
                if (!form.viaje_ida) return true;

                const viajeIda = viajes.find(v => v.id === form.viaje_ida);
                if (!viajeIda) return false;

                return hotel.ciudad_nombre === viajeIda.destino;
              })
              .map(hotel => (
                <option key={hotel.id} value={hotel.id}>
                  🏨 {hotel.nombre} - {hotel.ciudad_nombre} - ${hotel.precio_noche}/noche  
                </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="create-label">Total del Paquete ($)</label>  
          <input
            type="number"
            className="form-control"
            name="total"
            value={form.total}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Ingrese el total del paquete"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          <div className="create-button">
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creando Paquete...
              </>
            ) : (
              '🚌 Crear Paquete' 
            )}
          </div>
        </button>
      </form>
      
      {showModal && (
        <SuccessModal
          message="¡Paquete de viaje creado correctamente!" 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CreatePacks;