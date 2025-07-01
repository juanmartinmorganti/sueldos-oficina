
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const ListaClientes = ({ clientes }) => {
  return (
    <div>
      <h2>Clientes</h2>
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
