import React, { useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import '../../../styles/Staff/Create.css';
import SuccessModal from '../../../components/SuccessModal';

const CreateCars = () => {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [precioDia, setPrecioDia] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para loading

  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/staff/autos/agregar');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('access');

    const response = await fetch('http://127.0.0.1:8000/crear_auto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        marca,
        modelo,
        color,
        precio_dia: precioDia,
      }),
    });

    const data = await response.json();
    setIsLoading(false); // Se detiene el loading al recibir respuesta

    if (response.ok) {
      setShowModal(true)
      setMarca('');
      setModelo('');
      setColor('');
      setPrecioDia('');
    } else {
      alert('Error: ' + JSON.stringify(data));
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="mb-4 text-center create-title">Agregar Autos</h2>

        <div className="mb-3">
          <Form.Label className="create-label">Marca</Form.Label>
          <Form.Control type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
        </div>

        <div className="mb-3">
          <Form.Label className="create-label">Modelo</Form.Label>
          <Form.Control type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
        </div>

        <div className="mb-3">
          <Form.Label className="create-label">Color</Form.Label>
          <Form.Control type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
        </div>

        <div className="mb-4">
          <Form.Label className="create-label">Precio por día</Form.Label>
          <Form.Control type="number" value={precioDia} onChange={(e) => setPrecioDia(e.target.value)} required />
        </div>

        <Button variant="primary" type="submit" className="create-button w-100" disabled={isLoading}>
          <div className='create-button'>
          {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
          ) : (
            <div className="create-button">Guardar +</div>
          )}
          </div>
        </Button>
          {showModal && (
            <SuccessModal
            message="¡Auto agregado correctamente!"
            onClose={handleCloseModal}
            />
          )}
      </Form>
    </Container>
  );
};

export default CreateCars;
