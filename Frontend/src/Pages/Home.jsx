import React from "react";
import Header from "../components/Public/Header";
import Login from "./Login";
import Register from "./Register";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Package from "./Package";
import InsertarCodigo from "./InsertCode";
import "../styles/Home.css";
import Perfil from "./Perfil";
import Search from "../components/Public/Search";
import ReservarAsiento from "./ReservasAsiento";
import HotelesDisponibles from "./HotelesDisponibles";
import Pagar from "./Pagar";
// import Footer from '../components/Public/Footer'

function Home() {
  return (
    <>
      <Header />
      <Container className="mt-4 bg-video">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/paquetes" element={<Package />} />
          <Route path="/codigo" element={<InsertarCodigo />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/reservar_asientos/" element={<ReservarAsiento />} />
          <Route path="/hoteles-disponibles" element={<HotelesDisponibles />} />
          <Route path="/pagar" element={<Pagar />} />
        </Routes>
      </Container>
    </>
  );
}

function Welcome() {
  return (
    <div className="welcome">
      <h1 className="welcome__title">
        Bienvenido a <span className="highlight">ViajaYA</span>{" "}
        <i className="bx bx-bus" style={{ color: "#0d6efd" }}></i>
      </h1>

      <p className="welcome__subtitle">
        Explorá el mundo con nuestras ofertas de viaje en bus únicas y viví experiencias inolvidables.
      </p>

      <div className="welcome__buttons d-flex justify-content-center align-items-center gap-3 mb-5">
        <Search />
      </div>
    </div>
  );
}

export default Home;