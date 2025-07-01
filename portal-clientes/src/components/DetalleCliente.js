
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';

const DetalleCliente = ({ clientes }) => {
  const { id } = useParams();
  const cliente = clientes.find(c => c.id === parseInt(id));

  if (!cliente) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <Card>
      <Card.Header as="h2">{cliente.nombre}</Card.Header>
      <Card.Body>
        <Card.Title>Empleados</Card.Title>
        <ListGroup variant="flush">
          {cliente.empleados.map(empleado => (
            <ListGroup.Item key={empleado.id}>
              {empleado.nombre}
              <Link to={`/cliente/${cliente.id}/empleado/${empleado.id}`} className="float-end">
                <Button variant="secondary" size="sm">Ver Liquidaciones</Button>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Link to="/">
          <Button variant="secondary" className="mt-3">Volver a Clientes</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default DetalleCliente;
