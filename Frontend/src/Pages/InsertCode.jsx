import React, { useState } from "react";
import { Container, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Reutiliza los estilos del login

function InsertarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const usuarioId = localStorage.getItem("usuario_id");

    if (!usuarioId) {
      setError("No se encontró el ID de usuario. Intenta iniciar sesión nuevamente.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/log_code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: parseInt(usuarioId),
          codigo_activacion: codigo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Código inválido o expirado.");
        return;
      }

      if (data.access) {
        localStorage.setItem("access", data.access);
        localStorage.removeItem("usuario_id");
        navigate("/");
        window.location.href = "/";
      } else {
        setError("No se recibió el token de acceso.");
      }

    } catch (err) {
      console.error("Error al verificar el código:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Form onSubmit={handleSubmit} className="login-form shadow-lg" style={{ width: "500px" }}>
        <div className="login-volaya mb-3 text-center">
          <i className="bx bx-paper-plane" style={{ color: "#0d6efd", fontSize: "47px" }}></i>
          <span className="ms-2">VolaYA</span>
        </div>
        <p className="login-p mb-4">Ingresa el código que fue enviado a tu correo electrónico</p>
        <Form.Group controlId="codigo">
          <Form.Label className="login-label">Código de activación</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-key"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4" disabled={isLoading}>
          <div className="login-button">
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Verificando...
              </>
            ) : (
              "Verificar"
            )}
          </div>
        </Button>
         {error && <Alert className="mt-4" variant="danger">{error}</Alert>}
      </Form>
    </Container>
  );
}

export default InsertarCodigo;
