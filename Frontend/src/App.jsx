import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import HomeStaff from './Pages/Staff/HomeStaff';
import ListCars from './Pages/Staff/Cars/ListCars';
import ListHotels from './Pages/Staff/Hotels/ListHotels';
import ListPacks from './Pages/Staff/Packs/ListPacks';
import CreateCars from './Pages/Staff/Cars/CreateCars';
import CreateHotels from './Pages/Staff/Hotels/CreateHotels';
import CreatePacks from './Pages/Staff/Packs/CreatePacks';
import ProtectedRoute from './components/ProtectedRoute';
import 'boxicons/css/boxicons.min.css';
import Carrito from './Pages/Carrito';
import ListPais from './Pages/Staff/Pais/ListPais';
import CreatePais from './Pages/Staff/Pais/Createpais';
import ListCiudad from './Pages/Staff/Ciudades/ListCiudad';
import CreateCiudad from './Pages/Staff/Ciudades/CreateCiudad';
import ListPedidosPendientes from './Pages/Staff/Pendientes/ListPedidosPendientes';
import ListBuses from './Pages/Staff/Buses/ListBuses';  // Cambiado de ListAviones
import CreateBuses from './Pages/Staff/Buses/CreateBuses';  // Cambiado de CreateAviones
import ListViajes from './Pages/Staff/Viajes/ListViajes';  // Cambiado de ListVuelo
import CreateViajes from './Pages/Staff/Viajes/CreateViajes';  // Cambiado de CreateVuelo
import ViajesDisponibles from './Pages/ViajesDisponibles';  // Cambiado de VuelosDisponibles
import ListFacturas from './Pages/Staff/Facturas/ListFacturas';
import DashboardStaff from './Pages/Staff/DashboardStaff';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/viajes-disponibles" element={<ViajesDisponibles />} />  {/* Cambiado */}
      <Route path="/carrito" element={<Carrito />} />

      <Route
        path="/staff/*"
        element={
          <ProtectedRoute requireStaff={true}>
            <HomeStaff />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardStaff />} />
        <Route path="autos/lista" element={<ListCars />} />
        <Route path="autos/agregar" element={<CreateCars />} />
        <Route path="hoteles/lista" element={<ListHotels />} />
        <Route path="hoteles/agregar" element={<CreateHotels />} />
        <Route path="paquetes/lista" element={<ListPacks />} />
        <Route path="paquetes/crear" element={<CreatePacks />} />
        <Route path="pais/lista" element={<ListPais />} />
        <Route path="pais/crear" element={<CreatePais />} />
        <Route path="ciudad/lista" element={<ListCiudad />} />
        <Route path="ciudad/crear" element={<CreateCiudad/>} />
        <Route path="paquetes_pendientes" element={<ListPedidosPendientes/>} />
        <Route path="viajes/lista" element={<ListViajes/>} />  {/* Cambiado */}
        <Route path="viajes/crear" element={<CreateViajes />} />  {/* Cambiado */}
        <Route path="buses/lista" element={<ListBuses />} />  {/* Cambiado */}
        <Route path="buses/crear" element={<CreateBuses />} />  {/* Cambiado */}
        <Route path="facturas" element={<ListFacturas />} />
      </Route>
    </Routes>
  );
}

export default App;