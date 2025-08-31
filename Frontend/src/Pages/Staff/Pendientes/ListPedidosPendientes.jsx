import React, { useEffect, useState } from 'react';
import '../../../styles/Staff/Create.css';

const ListPedidosPendientes = () => {
  const [pedidos, setPedidos] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    

    Promise.all([
      fetch('http://127.0.0.1:8000/conseguir_paquetes_pendientes/', { headers }),
      fetch('http://127.0.0.1:8000/conseguir_vuelos/', { headers }),
      fetch('http://127.0.0.1:8000/conseguir_hoteles/', { headers }),
      fetch('http://127.0.0.1:8000/conseguir_autos/', { headers }),
    ])
      .then(async ([pedRes, vuelosRes, hotelesRes, autosRes]) => {
        if (!pedRes.ok) throw new Error('Error al obtener pedidos');
        if (!vuelosRes.ok) throw new Error('Error al obtener vuelos');
        if (!hotelesRes.ok) throw new Error('Error al obtener hoteles');
        if (!autosRes.ok) throw new Error('Error al obtener autos');

        const pedidosData = await pedRes.json();
        const vuelosData = await vuelosRes.json();
        const hotelesData = await hotelesRes.json();
        const autosData = await autosRes.json();

        setPedidos(pedidosData);
        setVuelos(vuelosData);
        setHoteles(hotelesData);
        setAutos(autosData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error cargando datos');
        setLoading(false);
      });
  }, []);

  
  const getVueloById = (id) => vuelos.find(v => v.id === id) || {};
  const getHotelById = (id) => hoteles.find(h => h.id === id) || {};
  const getAutoById = (id) => autos.find(a => a.id === id) || {};

  return (
    <div className="container mt-4">
      <div
        className="d-flex align-items-center mb-3 fw-bold gap-2"
        style={{ color: "#0d6efd", fontSize: "25px" }}
      >
        <i className="bx bx-time-five" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Pedidos Pendientes
      </div>
      {loading && <p className="text-center">Cargando pedidos...</p>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && pedidos.length === 0 && (
        <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>No hay pedidos pendientes.</p>
      )}

      {!loading && pedidos.length > 0 && (
        <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>ID Pedido</th>
                <th>Personas</th>
                <th>Vuelo Ida</th>
                <th>Vuelo Vuelta</th>
                <th>Asientos Ida</th>
                <th>Asientos Vuelta</th>
                <th>Hotel</th>
                <th>Auto</th>
                <th>Total (ARS)</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, idx) => {
                const vueloIda = getVueloById(pedido.vuelo_ida);
                const vueloVuelta = getVueloById(pedido.vuelo_vuelta);
                const hotel = getHotelById(pedido.hotel);
                const auto = pedido.auto ? getAutoById(pedido.auto) : null;

                return (
                  <tr key={idx}>
                    <td>{pedido.id || idx + 1}</td>
                    <td>{pedido.personas}</td>

                    <td>{pedido.vuelo_ida || '-'}</td>
                    <td>{pedido.vuelo_vuelta || '-'}</td>

                    <td>{pedido.asiento_ida.map(a => a.numero).join(' y ') || '-'}</td>

                    <td>
                      {pedido.asiento_vuelta && pedido.asiento_vuelta.length > 0
                        ? pedido.asiento_vuelta
                            .map(a => `Asiento ${a.numero} - ${a.vip ? 'VIP' : 'General'}`)
                            .join(', ')
                        : '-'}
                    </td>

                    <td>{pedido.hotel || '-'}</td>
                    <td>{auto ? auto.modelo : 'Ninguno'}</td>

                    <td>
                      {new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                      }).format(Number(pedido.total) || 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListPedidosPendientes;
