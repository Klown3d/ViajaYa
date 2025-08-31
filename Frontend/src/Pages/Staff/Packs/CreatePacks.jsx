import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreatePacks = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descripcion: '',
    personas: 1,
    vuelo_ida: '',
    vuelo_vuelta: '',
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

  const [vuelos, setVuelos] = useState([]);
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
        const [vuelosRes, autosRes, hotelesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/conseguir_vuelos/', { headers }),
          fetch('http://127.0.0.1:8000/conseguir_autos/', { headers }),
          fetch('http://127.0.0.1:8000/conseguir_hoteles/', { headers }),
        ]);

        const [vuelosData, autosData, hotelesData] = await Promise.all([
          vuelosRes.json(),
          autosRes.json(),
          hotelesRes.json()
        ]);

        setVuelos(vuelosData);
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

    if (['personas', 'total', 'vuelo_ida', 'vuelo_vuelta', 'auto', 'hotel'].includes(name)) {
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
            vuelo_ida: '',
            vuelo_vuelta: '',
            hotel: '',
            auto: '',
            total: 0,
          })
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear paquete');
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
      <h2 className="mb-4 text-center create-title">Crear Paquete</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="create-label">Cantidad de personas</label>
          <input type="number" className="form-control" name="personas" value={form.personas} onChange={handleChange} min="1" required />
        </div>

        <div className="mb-3">
          <label className="create-label">Vuelo de ida</label>
          <select className="form-control" name="vuelo_ida" value={form.vuelo_ida} onChange={handleChange} required>
            <option value="">Seleccionar vuelo</option>
            {vuelos.map(vuelo => {
              const fecha = new Date(vuelo.fecha);
              const fechaFormateada = fecha.toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <option key={vuelo.id} value={vuelo.id}>
                  Fecha: {fechaFormateada} - {vuelo.origen} a {vuelo.destino}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Vuelo de vuelta</label>
          <select className="form-control" name="vuelo_vuelta" value={form.vuelo_vuelta} onChange={handleChange} required>
            <option value="">Seleccionar vuelo</option>
              {vuelos
                .filter(vuelo => {
                  if (!form.vuelo_ida) return true;

                  const vueloIdaSeleccionado = vuelos.find(v => v.id === form.vuelo_ida);
                  if (!vueloIdaSeleccionado) return false;

                  const fechaIda = new Date(vueloIdaSeleccionado.fecha);
                  const fechaVuelta = new Date(vuelo.fecha);

                  const mismoDestinoOrigen = vuelo.destino === vueloIdaSeleccionado.origen;

                  return fechaVuelta >= fechaIda && mismoDestinoOrigen;
                })
                .map(vuelo => {
                  const fecha = new Date(vuelo.fecha);
                  const fechaFormateada = fecha.toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <option key={vuelo.id} value={vuelo.id}>
                      Fecha: {fechaFormateada} - {vuelo.origen} a {vuelo.destino}
                    </option>
                  );
              })}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Auto (opcional)</label>
          <select className="form-control" name="auto" value={form.auto} onChange={handleChange}>
            <option value="">Ninguno</option>
            {autos.map(auto => (
              <option key={auto.id} value={auto.id}>{auto.modelo}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Hotel (opcional)</label>
          <select className="form-control" name="hotel" value={form.hotel} onChange={handleChange}>
            <option value="">Ninguno</option>
            {hoteles
              .filter(hotel => {
                if (!form.vuelo_ida) return true;

                const vueloIda = vuelos.find(v => v.id === form.vuelo_ida);
                if (!vueloIda) return false;

                return hotel.ciudad_nombre === vueloIda.destino;
              })
              .map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="create-label">Total</label>
          <input
            type="number"
            className="form-control"
            name="total"
            value={form.total}
            onChange={handleChange}
            min="0"
            step="0.01"
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
              message="¡Paquete creado correctamente!"
              onClose={handleCloseModal}
            />
          )}
    </div>
  );
};

export default CreatePacks;

