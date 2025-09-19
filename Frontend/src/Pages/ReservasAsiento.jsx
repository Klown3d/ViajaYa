import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Staff/Asientos.css';

const ReservarAsiento = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { viajeIda, viajeVuelta, personas: personasRaw, destinoId, auto, autoSeleccionadoId, descripcion } = location.state || {};
  const personas = parseInt(personasRaw);

  const [asientosIda, setAsientosIda] = useState([]);
  const [asientosVuelta, setAsientosVuelta] = useState([]);
  const [seleccionIda, setSeleccionIda] = useState([]);
  const [seleccionVuelta, setSeleccionVuelta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarVuelta, setMostrarVuelta] = useState(false);
  const desdePaquete = location.state?.desdePaquete || false;

  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchAsientos = async () => {
      try {
        const [resIda, resVuelta] = await Promise.all([
          fetch(`http://127.0.0.1:8000/conseguir_asientos_viaje/${viajeIda.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }),
          fetch(`http://127.0.0.1:8000/conseguir_asientos_viaje/${viajeVuelta.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }),
        ]);
        

        const dataIda = await resIda.json();
        const dataVuelta = await resVuelta.json();

        setAsientosIda(dataIda);
        setAsientosVuelta(dataVuelta);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar asientos:', error);
        setLoading(false);
      }
    };

    fetchAsientos();
  }, [viajeIda.id, viajeVuelta.id]);

  const crearYRedirigirPaquete = async () => {
    try {
      // Paso 1: Cotizar viajes
      const cotizacionIda = await cotizarViajeSimple(viajeIda.id, seleccionIda);
      const cotizacionVuelta = await cotizarViajeSimple(viajeVuelta.id, seleccionVuelta);

      // Paso 2: Preparar datos para crear paquete
      const paqueteData = {
        viaje_ida: viajeIda.id,
        viaje_vuelta: viajeVuelta.id,
        hotel: location.state?.hotel_id || null, 
        auto: autoSeleccionadoId || null,
        personas,
        asiento_ida: seleccionIda.map(a => a.id),
        asiento_vuelta: seleccionVuelta.map(a => a.id),
        descripcion: location.state?.descripcion || '',
        total: cotizacionIda.costo + cotizacionVuelta.costo,
      };

      // Paso 3: Llamar a crear_paquete
      const response = await fetch('http://127.0.0.1:8000/crear_paquete/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paqueteData),
      });

      if (!response.ok) throw new Error('Error al crear el paquete');

      const data = await response.json();
      alert(data.message);

      // Paso 4: Redirigir al carrito
      navigate('/carrito');

    } catch (error) {
      console.error('Error al crear paquete desde Package:', error);
      alert('Ocurrió un error al crear el paquete');
    }
  };

  const marcarAsientosEnCompra = async (asientos) => {
    const token = localStorage.getItem('access');
    const response = await fetch('http://127.0.0.1:8000/marcar_asientos_en_compra/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asientos_ids: asientos.map(a => a.id),
      }),
    });
    if (!response.ok) {
      throw new Error('Error al marcar asientos como EN COMPRA');
    }
    return await response.json();
  };

  const cotizarViaje = async (viaje, seleccion) => {
    const token = localStorage.getItem('access');

    const response = await fetch('http://127.0.0.1:8000/cotizar_viaje/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        viaje_id: viaje.id,
        asientos_ids: seleccion.map(a => a.id)
      })
    });

    const data = await response.json();
    return data;
  };

  const handleSeleccionAsiento = (asiento, tipoViaje) => {
    const seleccion = tipoViaje === 'ida' ? seleccionIda : seleccionVuelta;
    const setSeleccion = tipoViaje === 'ida' ? setSeleccionIda : setSeleccionVuelta;

    if (asiento.reservado) return;

    const yaSeleccionado = seleccion.find(a => a.id === asiento.id);

    if (yaSeleccionado) {
      setSeleccion(prev => {
        const nuevaSeleccion = prev.filter(a => a.id !== asiento.id);
        if (tipoViaje === 'ida' && nuevaSeleccion.length < personas) {
          setMostrarVuelta(false);
        }
        return nuevaSeleccion;
      });
    } else if (seleccion.length < personas) {
      setSeleccion(prev => {
        const nuevaSeleccion = [...prev, asiento];
        if (tipoViaje === 'ida' && nuevaSeleccion.length === personas) {
          setMostrarVuelta(true);
        }
        return nuevaSeleccion;
      });
    } else {
      alert(`Solo puedes seleccionar hasta ${personas} asientos.`);
    }
  };

  const renderAsientos = (asientos, tipoViaje) => {
    const seleccion = tipoViaje === 'ida' ? seleccionIda : seleccionVuelta;

    const renderFila = (filaAsientos, indexBase) => {
      const mitad = Math.ceil(filaAsientos.length / 2);
      const ladoIzq = filaAsientos.slice(0, mitad);
      const ladoDer = filaAsientos.slice(mitad);

      return (
        <div key={indexBase} className="fila-bus">
          <div className="lado-izquierdo">{ladoIzq.map(a => renderAsiento(a, tipoViaje, seleccion))}</div>
          <div className="pasillo" />
          <div className="lado-derecho">{ladoDer.map(a => renderAsiento(a, tipoViaje, seleccion))}</div>
        </div>
      );
    };

    const filas = [];
    for (let i = 0; i < asientos.length; i += 4) {
      filas.push(renderFila(asientos.slice(i, i + 4), i));
    }

    return filas;
  };

  const renderAsiento = (asiento, tipoViaje, seleccion) => {
    const isSeleccionado = seleccion.find(a => a.id === asiento.id);
    const clases = [
      'asiento',
      asiento.reservado ? 'reservado' : 'libre',
      asiento.vip ? 'vip' : 'general',
      isSeleccionado ? 'seleccionado' : ''
    ].join(' ');

    return (
      <div
        key={asiento.id}
        className={clases}
        onClick={() => handleSeleccionAsiento(asiento, tipoViaje)}
      >
        {asiento.numero}
      </div>
    );
  };

  const puedeConfirmar = seleccionIda.length === personas && seleccionVuelta.length === personas;

  const confirmarSeleccion = async () => {
    const cotizacionIda = await cotizarViaje(viajeIda, seleccionIda);
    const cotizacionVuelta = await cotizarViaje(viajeVuelta, seleccionVuelta);

    const datosCotizacion = {
      destinoId,
      viajeIda,
      viajeVuelta,
      seleccionIda,
      seleccionVuelta,
      personas,
      costoIda: cotizacionIda.costo,
      costoVuelta: cotizacionVuelta.costo,
      costoTotal: cotizacionIda.costo + cotizacionVuelta.costo,
      autoSeleccionadoId,
      auto                 
    };

    sessionStorage.setItem('cotizacion', JSON.stringify(datosCotizacion));

    navigate('/hoteles-disponibles', { state: datosCotizacion });
  };

  const cotizarViajeSimple = async (viajeId, asientos) => {
    const token = localStorage.getItem('access');

    const response = await fetch('http://127.0.0.1:8000/cotizar_viaje/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        viaje_id: viajeId,
        asientos_ids: asientos.map(a => a.id)
      })
    });

    if (!response.ok) throw new Error('Error al cotizar el viaje');

    return await response.json();
  };

  return (
    <div className="contenedor-principal-asientos">
      <div className="pantalla-asientos">
        <div className={`pantalla paso-ida ${mostrarVuelta ? 'oculto' : ''}`}>
          <h3>
            Asientos para viaje de ida (
            {desdePaquete ? `Viaje #${viajeIda.id}` : `${viajeIda.origen} → ${viajeIda.destino}`}
            )
          </h3>
          {renderAsientos(asientosIda, 'ida')}
          <p className="text-muted mt-3">🧍 Seleccioná tus asientos de ida para continuar.</p>
        </div>

        <div className={`pantalla paso-vuelta ${mostrarVuelta ? 'visible' : ''}`}>
          <h3>
            Asientos para viaje de vuelta (
            {desdePaquete ? `Viaje #${viajeVuelta.id}` : `${viajeVuelta.origen} → ${viajeVuelta.destino}`}
            )
          </h3>
          {renderAsientos(asientosVuelta, 'vuelta')}
        </div>
      </div>

      <div className="resumen-asientos">
        <h5>🧍‍♂️ Selección ida</h5>
        <ul>
          {seleccionIda.map(a => (
            <li key={a.id}>Asiento {a.numero} ({a.vip ? 'VIP' : 'General'})</li>
          ))}
        </ul>

        <h5>🔙 Selección vuelta</h5>
        <ul>
          {seleccionVuelta.map(a => (
            <li key={a.id}>Asiento {a.numero} ({a.vip ? 'VIP' : 'General'})</li>
          ))}
        </ul>

        {desdePaquete ? (
          <button
            className="btn btn-success mt-3"
            disabled={!puedeConfirmar}
            onClick={crearYRedirigirPaquete}
          >
            Confirmar y ver carrito
          </button>
        ) : (
          <button
            className="btn btn-success mt-3"
            disabled={!puedeConfirmar}
            onClick={confirmarSeleccion}
          >
            Confirmar y ver hoteles
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservarAsiento;