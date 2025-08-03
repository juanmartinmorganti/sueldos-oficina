
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';

const ListaClientes = ({ clientes, onDataUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const newData = JSON.parse(e.target.result);
          onDataUpload(newData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Error al leer el archivo JSON. Asegúrate de que el formato es correcto.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>Clientes</h2>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Actualizar Datos (data.json)</Form.Label>
        <Form.Control type="file" accept=".json" onChange={handleFileChange} />
      </Form.Group>
      <div className="d-flex flex-wrap">
        {clientes.map(cliente => (
          <Card key={cliente.id} style={{ width: '18rem', margin: '1rem' }}>
            <Card.Body>
              <Card.Title>{cliente.nombre}</Card.Title>
              <Link to={`/cliente/${cliente.id}`}>
                <Button variant="primary">Ver Detalles</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListaClientes;
