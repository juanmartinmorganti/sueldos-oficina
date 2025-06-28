
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Table, Button } from 'react-bootstrap';

const DetalleLiquidacion = ({ clientes }) => {
  const { clienteId, empleadoId } = useParams();
  const cliente = clientes.find(c => c.id === parseInt(clienteId));
  const empleado = cliente?.empleados.find(e => e.id === parseInt(empleadoId));

  if (!empleado) {
    return <div>Empleado no encontrado</div>;
  }

  return (
    <Card>
      <Card.Header as="h2">Liquidaciones de {empleado.nombre}</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Adelanto</th>
              <th>Extras</th>
              <th>Básico</th>
              <th>No Remunerativo</th>
              <th>Inasistencias</th>
            </tr>
          </thead>
          <tbody>
            {empleado.liquidaciones.map(liquidacion => (
              <tr key={liquidacion.id}>
                <td>{liquidacion.mes}</td>
                <td>{liquidacion.adelanto || '-'}</td>
                <td>{liquidacion.extras || '-'}</td>
                <td>{liquidacion.basico || '-'}</td>
                <td>{liquidacion.no_remunerativo || '-'}</td>
                <td>{liquidacion.inasistencias || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Link to={`/cliente/${clienteId}`}>
          <Button variant="secondary" className="mt-3">Volver a Empleados</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default DetalleLiquidacion;
