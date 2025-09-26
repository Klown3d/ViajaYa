import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Header.css";
import VerifyToken from "./VerifyToken";

function Header() {
  const [expanded, setExpanded] = useState(false);
  const [username, setUsername] = useState(null)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    setUsername(null)
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      fetch('http://127.0.0.1:8000/conseguir_mi_usuario/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then(data => {
          setUsername(data.nombre_usuario);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      setUsername(null)
    }
  }, []);

  return (
    <>
      <VerifyToken />
      <Navbar
        expand="lg"
        expanded={expanded}
        className="navbar-custom"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
            <i
              className="bx bx-bus"  
              style={{ color: "#0d6efd", fontSize: "30px" }}
            ></i>
            BusYA  
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded((prev) => !prev)}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/paquetes" onClick={() => setExpanded(false)}>
                Paquetes
              </Nav.Link>

              {!username ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/login"
                    onClick={() => setExpanded(false)}
                  >
                    Iniciar sesión
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    onClick={() => setExpanded(false)}
                  >
                    Registrarse
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/perfil"
                    onClick={() => setExpanded(false)}
                  >
                    Perfil
                  </Nav.Link>
                  <Nav.Link
                    className="logout-link"
                    onClick={() => {
                      handleLogout();
                      setExpanded(false);
                    }}
                  >
                    Cerrar sesión
                  </Nav.Link>
                  <Nav.Link as={Link} to="/carrito" onClick={() => setExpanded(false)}>
                    Carrito
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;