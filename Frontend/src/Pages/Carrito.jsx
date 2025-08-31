import '../Styles/Carrito.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Public/Header';

const Carrito = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [totalCarrito, setTotalCarrito] = useState(null);
  const [reservasPendientes, setReservasPendientes] = useState([]);

  const formatFecha = (fechaISO) => {
    if (!fechaISO) return 'Sin fecha';
    return new Date(fechaISO).toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (paqueteId) => {
    const token = localStorage.getItem("access");

    if (!window.confirm("¿Estás seguro de que querés eliminar este paquete?")) return;

    const paqueteAEliminar = reservasPendientes.find(p => p.id === paqueteId);
    const totalPaquete = parseFloat(paqueteAEliminar?.total || 0);

    fetch(`http://127.0.0.1:8000/eliminar_paquete/${paqueteId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar el paquete");
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Paquete eliminado");

        setReservasPendientes((prev) => prev.filter((p) => p.id !== paqueteId));

        setTotalCarrito((prevTotal) => Math.max(0, prevTotal - totalPaquete));
      })
      .catch((err) => {
        console.error(err);
        alert("Error al eliminar el paquete");
      });
  };


  useEffect(() => {
    const token = localStorage.getItem('access');

    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/conseguir_mi_usuario/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Token inválido');
        return response.json();
      })
      .then(() => {
        return Promise.all([
          fetch('http://127.0.0.1:8000/conseguir_carrito/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://127.0.0.1:8000/conseguir_mis_reservas_pendientes/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
      })
      .then(async ([carritoRes, reservasRes]) => {
        if (!carritoRes.ok || !reservasRes.ok) throw new Error('Error en la obtención de datos');

        const carritoData = await carritoRes.json();
        const reservasData = await reservasRes.json();

        setTotalCarrito(carritoData?.total || 0);
        setReservasPendientes(reservasData || []);
        setIsValidating(false);
      })
      .catch(() => {
        localStorage.removeItem('access');
        navigate('/login');
        alert('Logeate como usuario normal para ver el carrito');
      });
  }, [navigate]);

  if (isValidating) return <div className="loading">Cargando...</div>;

  return (
    <>
      <Header />
      <div className="carrito-contenido">
        <h2 className="carrito-total">
          Total del carrito: {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(totalCarrito)}
        </h2>

        <h3 className="reservas-title">Reservas pendientes: {reservasPendientes.length}</h3>
        {reservasPendientes.length === 0 ? (
          <p className="sin-reservas">No tenés reservas pendientes.</p>
        ) : (
          <div className="reservas-lista">
            {reservasPendientes.map(reserva => (
              <div key={reserva.id} className="reserva-item">
                <p><strong>Descripción:</strong> {reserva.descripcion || 'Sin descripción'}</p>
                <p><strong>Personas:</strong> {reserva.personas}</p>
                <p><strong>Vuelo Ida:</strong> {reserva.vuelo_ida_obj?.origen_nombre} → {reserva.vuelo_ida_obj?.destino_nombre}</p>
                <p><strong>Fecha Vuelo Ida:</strong> {formatFecha(reserva.vuelo_ida_fecha)}</p>
                <p><strong>Vuelo Vuelta:</strong> {reserva.vuelo_vuelta_obj?.origen_nombre} → {reserva.vuelo_vuelta_obj?.destino_nombre}</p>
                <p><strong>Fecha Vuelo Vuelta:</strong> {formatFecha(reserva.vuelo_vuelta_fecha)}</p>
                <p><strong>Hotel:</strong> {reserva.hotel || 'Sin hotel'}</p>
                <p><strong>Auto:</strong> {reserva.auto || 'Sin auto'}</p>
                <p><strong>Asientos Ida:</strong> {
                  reserva.asiento_ida?.length > 0
                    ? reserva.asiento_ida.map(a => `#${a.numero} ${a.vip ? '(VIP)' : ''}`).join(', ')
                    : 'Sin asientos'
                }</p>
                <p><strong>Asientos Vuelta:</strong> {
                  reserva.asiento_vuelta?.length > 0
                    ? reserva.asiento_vuelta.map(a => `#${a.numero} ${a.vip ? '(VIP)' : ''}`).join(', ')
                    : 'Sin asientos'
                }</p>
                <p><strong>Total:</strong> {
                  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(reserva.total))
                }</p>

                <div className="reserva-botones">
                  <button
                    className="btn-pagar"
                    onClick={() => navigate('/pagar', { state: { reservaId: reserva.id, total: reserva.total } })}
                  >
                    💳 Pagar ahora
                  </button>
                  <button className="btn-eliminar" onClick={() => handleDelete(reserva.id)}>
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Carrito;