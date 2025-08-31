import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../styles/Staff/Asientos.css';
import {  useLocation } from 'react-router-dom';


const ListAsientos = () => {
  const { id } = useParams();
  const [asientos, setAsientos] = useState([]);
  const [loading, setLoading] = useState(true);
    const location = useLocation();
    const vueloDesdeState = location.state?.vuelo || null;
    const [vuelo, setVuelo] = useState(vueloDesdeState);

  useEffect(() => {
    const token = localStorage.getItem('access');

    // Fetch asientos
    fetch(`http://127.0.0.1:8000/conseguir_asientos_vuelo/${id}/`, {
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        }
    })
        .then(res => {
        if (!res.ok) throw new Error('Error al obtener los asientos');
        return res.json();
        })
        .then(data => {
        setAsientos(data);
        setLoading(false);
        })
        .catch(err => {
        console.error('Error al cargar asientos:', err);
        setLoading(false);
        });

    // Si no tenemos datos del vuelo, hacemos fetch para obtenerlo
    if (!vueloDesdeState) {
        fetch(`http://127.0.0.1:8000/conseguir_vuelo_detalle/${id}/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener detalles del vuelo');
            return res.json();
        })
        .then(data => setVuelo(data))
        .catch(err => {
            console.error('Error al cargar detalles del vuelo:', err);
        });
    }
    }, [id, vueloDesdeState]);

    const renderFilas = (asientos) => {
    const filas = [];

    for (let i = 0; i < asientos.length; i += 6) {
        const fila = asientos.slice(i, i + 6);
        let ladoIzquierdo = [];
        let ladoDerecho = [];

        if (fila.length < 6) {
        const mitad = Math.ceil(fila.length / 2);
        ladoIzquierdo = fila.slice(0, mitad);
        ladoDerecho = fila.slice(mitad);
        } else {
        ladoIzquierdo = fila.slice(0, 3);
        ladoDerecho = fila.slice(3, 6);
        }

        filas.push(
        <div key={i} className="fila-avion">
            <div className="lado-izquierdo">
            {ladoIzquierdo.map(renderAsiento)}
            </div>
            <div className="pasillo" />
            <div className="lado-derecho">
            {ladoDerecho.map(renderAsiento)}
            </div>
        </div>
        );
    }

    return filas;
    };

  const renderAsiento = (asiento) => (
    <div
      key={asiento.id}
      className={`asiento ${asiento.reservado ? 'reservado' : 'libre'} ${asiento.vip ? 'vip' : 'general'}`}
    >
      {asiento.numero}
    </div>
  );

  const vip = asientos.filter(a => a.vip);
  const generales = asientos.filter(a => !a.vip);

  return (
    <div className="contenedor-asientos">
        {vuelo && (
        <div className="datos-vuelo">
            <h3>Detalles del vuelo</h3>
            <p><strong>ID:</strong> {vuelo.id}</p>
            <p><strong>Avión:</strong> {vuelo.avion}</p>
            <p><strong>Origen:</strong> {vuelo.origen}</p>
            <p><strong>Destino:</strong> {vuelo.destino}</p>
            <p><strong>Fecha:</strong> {new Date(vuelo.fecha).toLocaleString()}</p>
        </div>
        )}
      {loading ? (
        <p>Cargando asientos...</p>
      ) : (
        <>
          <h4 className="titulo-clase">Clase VIP</h4>
          <div className="cabina-avion">{renderFilas(vip)}</div>

          <hr />

          <h4 className="titulo-clase">Clase General</h4>
          <div className="cabina-avion">{renderFilas(generales)}</div>
        </>
      )}
    </div>
  );
};

export default ListAsientos;