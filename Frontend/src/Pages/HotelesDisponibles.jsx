import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/HotelesDisponibles.css';

function HotelesDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    costoTotal,
    costoIda,
    costoVuelta,
    viajeIda,
    viajeVuelta,
    personas,
    destinoId,
    seleccionIda,
    seleccionVuelta,
    auto,
    autoSeleccionadoId
  } = location.state || {};

  // Validar que los datos necesarios estén presentes
  if (!viajeIda || !viajeVuelta || !destinoId) {
    return (
      <div className="hotel-container">
        <div className="error-message">
          <h3>❌ Error: Datos incompletos</h3>
          <p>No se encontró información suficiente para mostrar hoteles.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const formatoPesos = (valor) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(valor || 0);

  const calcularNoches = () => {
    if (!viajeIda?.fecha_salida || !viajeVuelta?.fecha_salida) return 1;

    try {
      const salida = new Date(viajeIda.fecha_salida);
      const vuelta = new Date(viajeVuelta.fecha_salida);

      salida.setHours(0, 0, 0, 0);
      vuelta.setHours(0, 0, 0, 0);

      const diferenciaMs = vuelta - salida;
      const noches = diferenciaMs / (1000 * 60 * 60 * 24);

      return noches > 0 ? Math.ceil(noches) : 1;
    } catch (error) {
      console.error('Error calculando noches:', error);
      return 1;
    }
  };

  const noches = calcularNoches();
  const totalAuto = auto ? (auto.precio_dia || 0) * noches : 0;

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8000/conseguir_hotel_ciudad/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          },
          body: JSON.stringify({ 
            ciudad_id: destinoId, 
            personas: personas || 1 
          })
        });

        if (!res.ok) {
          throw new Error('Error al obtener hoteles');
        }

        const data = await res.json();
        setHoteles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener hoteles:', error);
        setError('No se pudieron cargar los hoteles. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
  }, [destinoId, personas]);

  const handleAgregarAlCarrito = async (hotel) => {
    try {
      const totalHotel = (hotel.precio_noche || 0) * noches;
      const totalFinal = Number(((costoTotal || 0) + totalHotel + totalAuto).toFixed(2));

      const data = {
        personas: personas || 1,
        viaje_ida: viajeIda.id,
        viaje_vuelta: viajeVuelta.id,
        hotel: hotel.id,
        total: totalFinal,
        asiento_ida: (seleccionIda || []).map(a => a.id),
        asiento_vuelta: (seleccionVuelta || []).map(a => a.id),
        auto: autoSeleccionadoId || null
      };

      const res = await fetch('http://127.0.0.1:8000/crear_paquete/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      
      if (res.ok) {
        alert(`✅ Paquete creado: ${result.message} - Total: ${formatoPesos(result.costo_total)}`);
        navigate('/carrito');
      } else {
        alert(`❌ Error al crear paquete: ${result.error || JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('Error al agregar paquete:', err);
      alert('❌ Error de conexión. Intente nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="hotel-container">
        <div className="loading">Cargando hoteles disponibles...</div>
      </div>
    );
  }

  return (
    <div className="hotel-container">
      <div className="package-summary">
        <h3>💸 Total del paquete: {formatoPesos((costoTotal || 0) + totalAuto)}</h3>
        <p><strong>🚌 Ida:</strong> {viajeIda.origen} → {viajeIda.destino} | {formatoPesos(costoIda)}</p>
        <p><strong>🔙 Vuelta:</strong> {viajeVuelta.origen} → {viajeVuelta.destino} | {formatoPesos(costoVuelta)}</p>
        <p><strong>👥 Personas:</strong> {personas}</p>
        <p><strong>🛏️ Noches de estadía:</strong> {noches}</p>

        {auto && (
          <>
            <p><strong>🚗 Auto seleccionado:</strong> {auto.marca} {auto.modelo}</p>
            <p><strong>🧾 Total auto:</strong> {formatoPesos(totalAuto)}</p>
          </>
        )}
      </div>

      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      <h4 className="hotel-header">
        🏨 Hoteles disponibles en {hoteles[0]?.ciudad_nombre || 'el destino'}
      </h4>
      
      <div className="hotel-list">
        {hoteles.length > 0 ? (
          hoteles.map((hotel) => {
            const totalHotel = (hotel.precio_noche || 0) * noches;
            const totalFinal = (costoTotal || 0) + totalHotel + totalAuto;

            return (
              <div key={hotel.id} className="hotel-card">
                <h5>{hotel.nombre}</h5>
                <p><strong>Descripción:</strong> {hotel.descripcion || 'Sin descripción'}</p>
                <p><strong>Dirección:</strong> {hotel.direccion || 'No especificada'}</p>
                <p><strong>Ciudad:</strong> {hotel.ciudad_nombre}, {hotel.pais_nombre}</p>
                <p><strong>Capacidad:</strong> {hotel.personas} personas</p>
                <p><strong>Precio por noche:</strong> {formatoPesos(hotel.precio_noche)}</p>
                <p><strong>Total hotel ({noches} noches):</strong> {formatoPesos(totalHotel)}</p>
                <p><strong>💵 Total paquete con este hotel:</strong> {formatoPesos(totalFinal)}</p>
                <button 
                  className="btn-add-to-cart" 
                  onClick={() => handleAgregarAlCarrito(hotel)}
                >
                  Agregar al carrito
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-hotels">
            <p>No hay hoteles disponibles para los criterios seleccionados.</p>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Realizar nueva búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelesDisponibles;