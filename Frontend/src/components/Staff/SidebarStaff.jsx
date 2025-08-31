import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Staff/Sidebar.css';

const SidebarStaff = () => {
  const [openMenu, setOpenMenu] = useState('');

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? '' : menu);
  };

  return (
    <aside className="staff-sidebar">
      <h2>Panel Admin</h2>
      <nav>
        <ul>
          <li>
            <Link to="/staff/">
            <button className="sidebar-toggle" onClick={() => toggleMenu('dashboard')}>
              < i className='bx  bx-home-alt-2'  ></i>  Dashboard
              <i className={`bx bx-transparentt-${openMenu === 'dashboard' ? 'up' : 'down'}`}></i>
            </button>
            </Link>
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('paises')}>
              <i className='bx bx-flag'></i> Paises
              <i className={`bx bx-chevron-${openMenu === 'paises' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'paises' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/pais/lista">
                    <i className="bx bx-list-ul"></i> Listar Paises
                  </Link>
                </li>
                <li>
                  <Link to="/staff/pais/crear">
                    <i className="bx bx-plus"></i> Agregar Pais
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('ciudades')}>
              <i className='bx bx-buildings'></i> Ciudades
              <i className={`bx bx-chevron-${openMenu === 'ciudades' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'ciudades' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/ciudad/lista">
                    <i className="bx bx-list-ul"></i> Listar Ciudad
                  </Link>
                </li>
                <li>
                  <Link to="/staff/ciudad/crear">
                    <i className="bx bx-plus"></i> Agregar Ciudad
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('autos')}>
              <i className='bx bx-car'></i> Autos
              <i className={`bx bx-chevron-${openMenu === 'autos' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'autos' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/autos/lista">
                    <i className="bx bx-list-ul"></i> Listar Autos
                  </Link>
                </li>
                <li>
                  <Link to="/staff/autos/agregar">
                    <i className="bx bx-plus"></i> Agregar Auto
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('hoteles')}>
              <i className='bx bx-hotel'></i> Hoteles
              <i className={`bx bx-chevron-${openMenu === 'hoteles' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'hoteles' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/hoteles/lista">
                    <i className="bx bx-list-ul"></i> Listar Hoteles
                  </Link>
                </li>
                <li>
                  <Link to="/staff/hoteles/agregar">
                    <i className="bx bx-plus"></i> Agregar Hotel
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('aviones')}>
              <i className='bx bx-paper-plane'></i> Aviones
              <i className={`bx bx-chevron-${openMenu === 'aviones' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'aviones' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/aviones/lista">
                    <i className="bx bx-list-ul"></i> Listar Aviones
                  </Link>
                </li>
                <li>
                  <Link to="/staff/aviones/crear">
                    <i className="bx bx-plus"></i> Agregar Aviones
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('vuelos')}>
              <i className='bx bx-calendar-week'></i> Vuelos
              <i className={`bx bx-chevron-${openMenu === 'vuelos' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'vuelos' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/vuelos/lista">
                    <i className="bx bx-list-ul"></i> Listar Vuelos
                  </Link>
                </li>
                <li>
                  <Link to="/staff/vuelos/crear">
                    <i className="bx bx-plus"></i> Agregar Vuelos
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('paquetes')}>
              <i className='bx bx-package'></i> Paquetes
              <i className={`bx bx-chevron-${openMenu === 'paquetes' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'paquetes' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/paquetes/lista">
                    <i className="bx bx-list-ul"></i> Listar Paquetes
                  </Link>
                </li>
                <li>
                  <Link to="/staff/paquetes/crear">
                    <i className="bx bx-plus"></i> Crear Paquete
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('pendientes')}>
              <i className='bx bx-time-five'></i> Pedidos Pendientes
              <i className={`bx bx-chevron-${openMenu === 'pendientes' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'pendientes' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/paquetes_pendientes">
                    <i className="bx bx-list-ul"></i> Listar Pedidos Pendientes
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('facturas')}>
              <i className='bx bx-book'></i> Facturas
              <i className={`bx bx-chevron-${openMenu === 'facturas' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'facturas' && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/staff/facturas">
                    <i className='bx bx-list-ul'></i> Listar Facturas
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarStaff;
