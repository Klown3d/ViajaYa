import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Staff/Asientos.css';

const ReservarAsiento = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { vueloIda, vueloVuelta, personas: personasRaw, destinoId, auto, autoSeleccionadoId, descripcion } = location.state || {};
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
          fetch(`http://127.0.0.1:8000/conseguir_asientos_vuelo/${vueloIda.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }),
          fetch(`http://127.0.0.1:8000/conseguir_asientos_vuelo/${vueloVuelta.id}/`, {
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
  }, [vueloIda.id, vueloVuelta.id]);

    const crearYRedirigirPaquete = async () => {
    try {
      // Paso 1: Cotizar vuelos
      const cotizacionIda = await cotizarVueloSimple(vueloIda.id, seleccionIda);
      const cotizacionVuelta = await cotizarVueloSimple(vueloVuelta.id, seleccionVuelta);

      // Paso 2: Preparar datos para crear paquete
      const paqueteData = {
        vuelo_ida: vueloIda.id,
        vuelo_vuelta: vueloVuelta.id,
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

  const cotizarVuelo = async (vuelo, seleccion) => {
    const token = localStorage.getItem('access');

    const response = await fetch('http://127.0.0.1:8000/cotizar_vuelo/', {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        vuelo_id: vuelo.id,
        asientos_ids: seleccion.map(a => a.id)
        })
    });

    const data = await response.json();
    return data;
    };


    const handleSeleccionAsiento = (asiento, tipoVuelo) => {
    const seleccion = tipoVuelo === 'ida' ? seleccionIda : seleccionVuelta;
    const setSeleccion = tipoVuelo === 'ida' ? setSeleccionIda : setSeleccionVuelta;

    if (asiento.reservado) return;

    const yaSeleccionado = seleccion.find(a => a.id === asiento.id);

    if (yaSeleccionado) {
        setSeleccion(prev => {
        const nuevaSeleccion = prev.filter(a => a.id !== asiento.id);
        if (tipoVuelo === 'ida' && nuevaSeleccion.length < personas) {
            setMostrarVuelta(false);
        }
        return nuevaSeleccion;
        });
    } else if (seleccion.length < personas) {
        setSeleccion(prev => {
        const nuevaSeleccion = [...prev, asiento];
        if (tipoVuelo === 'ida' && nuevaSeleccion.length === personas) {
            setMostrarVuelta(true);
        }
        return nuevaSeleccion;
        });
    } else {
        alert(`Solo puedes seleccionar hasta ${personas} asientos.`);
    }
    };


  const renderAsientos = (asientos, tipoVuelo) => {
    const seleccion = tipoVuelo === 'ida' ? seleccionIda : seleccionVuelta;

    const renderFila = (filaAsientos, indexBase) => {
      const mitad = Math.ceil(filaAsientos.length / 2);
      const ladoIzq = filaAsientos.slice(0, mitad);
      const ladoDer = filaAsientos.slice(mitad);

      return (
        <div key={indexBase} className="fila-avion">
          <div className="lado-izquierdo">{ladoIzq.map(a => renderAsiento(a, tipoVuelo, seleccion))}</div>
          <div className="pasillo" />
          <div className="lado-derecho">{ladoDer.map(a => renderAsiento(a, tipoVuelo, seleccion))}</div>
        </div>
      );
    };

    const filas = [];
    for (let i = 0; i < asientos.length; i += 6) {
      filas.push(renderFila(asientos.slice(i, i + 6), i));
    }

    return filas;
  };

  const renderAsiento = (asiento, tipoVuelo, seleccion) => {
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
        onClick={() => handleSeleccionAsiento(asiento, tipoVuelo)}
      >
        {asiento.numero}
      </div>
    );
  };

  const puedeConfirmar = seleccionIda.length === personas && seleccionVuelta.length === personas;

    const confirmarSeleccion = async () => {
        const cotizacionIda = await cotizarVuelo(vueloIda, seleccionIda);
        const cotizacionVuelta = await cotizarVuelo(vueloVuelta, seleccionVuelta);

    const datosCotizacion = {
      destinoId,
      vueloIda,
      vueloVuelta,
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

    const cotizarVueloSimple = async (vueloId, asientos) => {
  const token = localStorage.getItem('access');

  const response = await fetch('http://127.0.0.1:8000/cotizar_vuelo/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vuelo_id: vueloId,
      asientos_ids: asientos.map(a => a.id)
    })
  });

  if (!response.ok) throw new Error('Error al cotizar el vuelo');

  return await response.json();
};


  return (
        <div className="contenedor-principal-asientos">
            <div className="pantalla-asientos">
                <div className={`pantalla paso-ida ${mostrarVuelta ? 'oculto' : ''}`}>
                <h3>
                  Asientos para vuelo de ida (
                  {desdePaquete ? `Vuelo #${vueloIda.id}` : `${vueloIda.origen} → ${vueloIda.destino}`}
                  )
                </h3>
                {renderAsientos(asientosIda, 'ida')}
                <p className="text-muted mt-3">🧍 Seleccioná tus asientos de ida para continuar.</p>
                </div>

                <div className={`pantalla paso-vuelta ${mostrarVuelta ? 'visible' : ''}`}>
                <h3>
                  Asientos para vuelo de vuelta (
                  {desdePaquete ? `Vuelo #${vueloVuelta.id}` : `${vueloVuelta.origen} → ${vueloVuelta.destino}`}
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
