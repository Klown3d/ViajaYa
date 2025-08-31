import React, { useState, useEffect } from 'react';
import '../../styles/Search.css';
import { useNavigate } from 'react-router-dom';


function Search() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState([]);
  const [mostrarSugerenciasOrigen, setMostrarSugerenciasOrigen] = useState(false);
  const [mostrarSugerenciasDestino, setMostrarSugerenciasDestino] = useState(false);

  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaVuelta, setFechaVuelta] = useState('');
  const [error, setError] = useState('');
  const [personas, setPersonas] = useState(1);
  const [token] = useState(localStorage.getItem('access') || '');
  const [autos, setAutos] = useState([]);
  const [autoSeleccionadoId, setAutoSeleccionadoId] = useState(null);

  const [origenId, setOrigenId] = useState(null);
  const [destinoId, setDestinoId] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchAutos = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await fetch('http://127.0.0.1:8000/conseguir_autos/', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        const data = await res.json();
        setAutos(data);
      } catch (error) {
        console.error('Error al traer autos:', error);
      }
    };

    fetchAutos();
  }, []);

  const buscarSugerencias = async (valor, setSugerencias, setMostrar) => {
    if (valor.length >= 3) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/buscar_hoteles/?search=${valor}`);
        const data = await res.json();
        setSugerencias(data);
        setMostrar(true);
      } catch (err) {
        console.error("Error al buscar hoteles:", err);
      }
    } else {
      setSugerencias([]);
      setMostrar(false);
    }
  };

  const handleChangeOrigen = (e) => {
    const valor = e.target.value;
    setOrigen(valor);
    setOrigenId(null);
    buscarSugerencias(valor, setSugerenciasOrigen, setMostrarSugerenciasOrigen);
  };

  const handleChangeDestino = (e) => {
    const valor = e.target.value;
    setDestino(valor);
    setDestinoId(null);
    buscarSugerencias(valor, setSugerenciasDestino, setMostrarSugerenciasDestino);
  };

  const seleccionarSugerenciaOrigen = (id, ciudad, pais) => {
    setOrigen(`${ciudad}, ${pais}`);
    setOrigenId(id);
    setMostrarSugerenciasOrigen(false);
  };

  const seleccionarSugerenciaDestino = (id, ciudad, pais) => {
    setDestino(`${ciudad}, ${pais}`);
    setDestinoId(id);
    setMostrarSugerenciasDestino(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const salida = new Date(fechaSalida);
    const vuelta = new Date(fechaVuelta);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSalida && salida < hoy) {
      setError('La fecha de salida no puede ser anterior a hoy.');
      return;
    }

    if (fechaVuelta && vuelta < hoy) {
      setError('La fecha de vuelta no puede ser anterior a hoy.');
      return;
    }

    if (fechaSalida && fechaVuelta && vuelta < salida) {
      setError('La fecha de vuelta no puede ser anterior a la de salida.');
      return;
    }

    if (!origenId || !destinoId) {
      setError('Debe seleccionar un origen y un destino válidos de la lista.');
      return;
    }

    if (origenId === destinoId) {
      alert('La ciudad de origen y destino no pueden ser iguales.');
      return;
    }

    setError('');
    // console.log('Formulario válido');

const buscarDestinos = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/obtener_vuelos_personalizados/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personas,
        fecha_ida: fechaSalida,
        fecha_vuelta: fechaVuelta,
        destino: destinoId,
        origen: origenId
      }),
    });

    if (!res.ok) {
      throw new Error('Error en la búsqueda');
    }

    const data = await res.json();
    // console.log(data);

    const autoSeleccionado = autos.find(a => a.id === parseInt(autoSeleccionadoId));

    navigate('/vuelos-disponibles', {
      state: {
        vuelosIda: data.vuelos_ida,
        vuelosVuelta: data.vuelos_vuelta,
        personas,
        fechaSalida,
        fechaVuelta,
        origenId,
        destinoId,
        origen,
        destino,
        autoSeleccionadoId,
        auto: autoSeleccionado || null
      }
    });

    } catch (err) {
      console.error("Error al buscar vuelos:", err);
      setError('Error al buscar vuelos disponibles.');
    }
  };


    buscarDestinos();
  };

  const handleChangeAuto = (e) => {
    setAutoSeleccionadoId(e.target.value);
  };

  return (
    <div className="container py-4">
      <form className="container mt-4" onSubmit={handleSubmit}>
        {/* Primera fila: Origen, Destino, Fecha de ida, Fecha vuelta */}
        <div className="row g-3 align-items-end">
          {/* Origen */}
          <div className="col-md-3 position-relative">
            <label className="form-label">Origen:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ciudad de origen"
              value={origen}
              onChange={handleChangeOrigen}
              onFocus={() => setMostrarSugerenciasOrigen(true)}
              onBlur={() => setTimeout(() => setMostrarSugerenciasOrigen(false), 200)}
            />
            {mostrarSugerenciasOrigen && sugerenciasOrigen.length > 0 && (
              <ul className="sugerencias-lista">
                {sugerenciasOrigen.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => seleccionarSugerenciaOrigen(item.id_ciudad, item.ciudad_nombre, item.pais_nombre)}
                  >
                    {item.ciudad_nombre}, {item.pais_nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destino */}
          <div className="col-md-3 position-relative">
            <label className="form-label">Destino:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ciudad de destino"
              value={destino}
              onChange={handleChangeDestino}
              onFocus={() => setMostrarSugerenciasDestino(true)}
              onBlur={() => setTimeout(() => setMostrarSugerenciasDestino(false), 200)}
            />
            {mostrarSugerenciasDestino && sugerenciasDestino.length > 0 && (
              <ul className="sugerencias-lista">
                {sugerenciasDestino.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => seleccionarSugerenciaDestino(item.id_ciudad, item.ciudad_nombre, item.pais_nombre)}
                  >
                    {item.ciudad_nombre}, {item.pais_nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fecha ida */}
          <div className="col-md-3">
            <label className="form-label">Fecha de ida:</label>
            <input
              type="date"
              className="form-control"
              value={fechaSalida}
              min={today}
              onChange={(e) => setFechaSalida(e.target.value)}
            />
          </div>

          {/* Fecha vuelta */}
          <div className="col-md-3">
            <label className="form-label">Fecha vuelta:</label>
            <input
              type="date"
              className="form-control"
              value={fechaVuelta}
              min={today}
              onChange={(e) => setFechaVuelta(e.target.value)}
            />
          </div>
        </div>

        {/* Segunda fila: Personas y Autos */}
        <div className="row mt-3 g-3 align-items-end">
          {/* Personas */}
          <div className="col-md-3">
            <label className="form-label">Personas:</label>
            <input
              type="number"
              className="form-control"
              value={personas}
              min="1"
              max="10"
              onChange={(e) => setPersonas(e.target.value)}
            />
          </div>

          {/* Autos */}
          <div className="col-md-6">
            <label className="form-label">Autos:</label>
            <select
              className="form-select"
              onChange={handleChangeAuto}
              value={autoSeleccionadoId || ''}
              size="1"
            >
              <option value="">Sin auto</option>
              {autos.map((auto) => (
                <option key={auto.id} value={auto.id}>
                  {auto.marca} {auto.modelo}
                </option>
              ))}
            </select>
          </div>

          {/* Botón buscar */}
          <div className="col-md-3 d-grid">
            <button type="submit" className="btn btn-primary">
              <i className="bx bx-search me-2"></i>Buscar
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}

export default Search;
