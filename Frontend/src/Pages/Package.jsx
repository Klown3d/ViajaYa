import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Package.css";
import 'boxicons/css/boxicons.min.css';
import { useAuth } from "../context/AuthContext"; 

function Package() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuth(); // Obtenemos el estado de autenticación
  const navigate = useNavigate();

  const packagesPerPage = 3;

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/conseguir_paquetes_en_venta/');
        if (!response.ok) {
          throw new Error('No se pudieron obtener los paquetes');
        }
        const data = await response.json();
        setPaquetes(data);
      } catch (error) {
        console.error('Error al obtener paquetes:', error);
        alert('Ocurrió un error al cargar los paquetes. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, []);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const totalPages = Math.ceil(paquetes.length / packagesPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const paquetesVisibles = paquetes.slice(
    currentPage * packagesPerPage,
    currentPage * packagesPerPage + packagesPerPage
  );

  const handleAsientosClick = (paquete) => {
    if (isAuthenticated) {
      navigate('/reservar_asientos', {
        state: {
          viajeIda: paquete.viaje_ida_obj,  // Cambiado de vueloIda
          viajeVuelta: paquete.viaje_vuelta_obj,  // Cambiado de vueloVuelta
          personas: paquete.personas,
          destinoId: paquete.destino_id,
          auto: paquete.auto,
          autoSeleccionadoId: paquete.auto_id,
          hotel_id: paquete.hotel_id,
          descripcion: paquete.descripcion,
          desdePaquete: true,
        }
      });
    } else {
      alert("Por favor, inicie sesión para elegir los asientos.");
      navigate('/login'); 
    }
  };

  return (
    <div className="container paquetes-container">
      <h2 className="titulo-principal">Explora Nuestros Paquetes</h2>

      {loading ? (
        <p className="text-center">Cargando paquetes...</p>
      ) : paquetes.length === 0 ? (
        <p className="text-center">No hay paquetes disponibles por el momento.</p>
      ) : (
        <div className="carousel-wrapper">
          {/* Flecha anterior */}
          <button
            className="carousel-arrow prev"
            onClick={handlePrev}
            disabled={paquetes.length <= packagesPerPage}
          >
            <i className='bx bx-chevron-left'></i>
          </button>

          {/* Contenedor de paquetes visibles */}
          <div className="carousel-container-inner">
            <div className="row g-4 justify-content-center">
              {paquetesVisibles.map((paquete) => (
                <div key={paquete.id} className="col-md-6 col-lg-4">
                  <div className="card paquete-card shadow h-100">
                    <div className="card-body">
                      <h5 className="card-title text-primary fw-bold mb-3">
                        {paquete.descripcion || `Paquete #${paquete.id}`}
                      </h5>
                      <ul className="list-unstyled paquete-list">
                        <li><i className="bx bx-user"></i> <strong>Personas:</strong> {paquete.personas}</li>
                        <li><i className="bx bx-bus"></i> <strong>Viaje ida:</strong> {formatearFecha(paquete.viaje_ida_fecha)} - {paquete.viaje_ida}</li>
                        <li><i className="bx bx-bus"></i> <strong>Viaje vuelta:</strong> {formatearFecha(paquete.viaje_vuelta_fecha)} - {paquete.viaje_vuelta}</li>
                        <li><i className="bx bx-building-house"></i> <strong>Hotel:</strong> {paquete.hotel}</li>
                        <li><i className="bx bx-car"></i> <strong>Auto:</strong> {paquete.auto || 'Sin auto'}</li>
                        <li><i className="bx bx-dollar-circle"></i> <strong>Total:</strong> ${parseFloat(paquete.total).toLocaleString()}</li>
                      </ul>
                    </div>
                    <div className="card-footer text-end bg-transparent border-0">
                      <button
                        className="btn btn-outline-primary btn-sm boton-reserva"
                        onClick={() => handleAsientosClick(paquete)} // Llama a la función para manejar el click
                      >
                        Elegir asientos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flecha siguiente */}
          <button
            className="carousel-arrow next"
            onClick={handleNext}
            disabled={paquetes.length <= packagesPerPage}
          >
            <i className='bx bx-chevron-right'></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default Package;