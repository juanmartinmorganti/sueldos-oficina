import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';

// Helper to create a deep copy
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const Admin = ({ data, setData }) => {
  // Client Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalData, setClientModalData] = useState(null);

  // Employee List Modal
  const [showEmployeeListModal, setShowEmployeeListModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Employee Add/Edit Modal
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeeModalData, setEmployeeModalData] = useState(null);

  // Liquidation Add/Edit Modal
  const [showLiquidationModal, setShowLiquidationModal] = useState(false);
  const [liquidationModalData, setLiquidationModalData] = useState(null);

  // When the main data changes, if a client is selected, update it
  useEffect(() => {
    if (selectedClient) {
      const updatedClient = data.clientes.find(c => c.id === selectedClient.id);
      setSelectedClient(updatedClient);
    }
  }, [data, selectedClient]);

  const handleDownload = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Client CRUD ---
  const handleClientSave = () => {
    let updatedClientes;
    if (clientModalData.id) { // Edit
      updatedClientes = data.clientes.map(c => c.id === clientModalData.id ? clientModalData : c);
    } else { // Add
      const newId = data.clientes.length > 0 ? Math.max(...data.clientes.map(c => c.id)) + 1 : 1;
      updatedClientes = [...data.clientes, { ...clientModalData, id: newId, empleados: [] }];
    }
    setData({ ...data, clientes: updatedClientes });
    setShowClientModal(false);
  };

  const handleClientDelete = (id) => {
    setData({ ...data, clientes: data.clientes.filter(c => c.id !== id) });
  };

  // --- Employee CRUD ---
  const handleEmployeeSave = () => {
    const clientIndex = data.clientes.findIndex(c => c.id === selectedClient.id);
    if (clientIndex === -1) return;

    let updatedEmployees;
    if (employeeModalData.id) { // Edit
      updatedEmployees = selectedClient.empleados.map(e => e.id === employeeModalData.id ? employeeModalData : e);
    } else { // Add
      const newId = selectedClient.empleados.length > 0 ? Math.max(...selectedClient.empleados.map(e => e.id)) + 1 : 1;
      updatedEmployees = [...selectedClient.empleados, { ...employeeModalData, id: newId, liquidaciones: [] }];
    }
    
    const updatedClientes = deepCopy(data.clientes);
    updatedClientes[clientIndex].empleados = updatedEmployees;
    
    setData({ ...data, clientes: updatedClientes });
    setShowEmployeeModal(false);
  };

  const handleEmployeeDelete = (employeeId) => {
    const clientIndex = data.clientes.findIndex(c => c.id === selectedClient.id);
    if (clientIndex === -1) return;

    const updatedEmployees = selectedClient.empleados.filter(e => e.id !== employeeId);
    const updatedClientes = deepCopy(data.clientes);
    updatedClientes[clientIndex].empleados = updatedEmployees;
    setData({ ...data, clientes: updatedClientes });
  };

  // --- Liquidation CRUD (operates on employeeModalData state) ---
  const handleLiquidationSave = () => {
    let updatedLiquidaciones;
    if (liquidationModalData.id) { // Edit
        updatedLiquidaciones = employeeModalData.liquidaciones.map(l => l.id === liquidationModalData.id ? liquidationModalData : l);
    } else { // Add
        const newId = employeeModalData.liquidaciones.length > 0 ? Math.max(...employeeModalData.liquidaciones.map(l => l.id)) + 1 : 1;
        updatedLiquidaciones = [...employeeModalData.liquidaciones, { ...liquidationModalData, id: newId }];
    }
    setEmployeeModalData({ ...employeeModalData, liquidaciones: updatedLiquidaciones });
    setShowLiquidationModal(false);
  };

  const handleLiquidationDelete = (liquidationId) => {
    const updatedLiquidaciones = employeeModalData.liquidaciones.filter(l => l.id !== liquidationId);
    setEmployeeModalData({ ...employeeModalData, liquidaciones: updatedLiquidaciones });
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <Button onClick={() => { setClientModalData({ nombre: '' }); setShowClientModal(true); }} className="mb-3">Agregar Cliente</Button>
      <Button onClick={handleDownload} className="mb-3 ms-2">Descargar data.json</Button>

      <Table striped bordered hover>
        <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
        <tbody>
          {data.clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => { setClientModalData(deepCopy(cliente)); setShowClientModal(true); }}>Editar</Button>
                <Button variant="info" size="sm" className="ms-2" onClick={() => { setSelectedClient(cliente); setShowEmployeeListModal(true); }}>Gestionar Empleados</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleClientDelete(cliente.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Client Add/Edit Modal */}
      {clientModalData && <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
        <Modal.Header closeButton><Modal.Title>{clientModalData.id ? 'Editar' : 'Agregar'} Cliente</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group><Form.Label>Nombre</Form.Label><Form.Control type="text" value={clientModalData.nombre} onChange={(e) => setClientModalData({ ...clientModalData, nombre: e.target.value })} /></Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClientModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleClientSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>}

      {/* Employee List Modal */}
      {selectedClient && <Modal show={showEmployeeListModal} onHide={() => setShowEmployeeListModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Gestionar Empleados de {selectedClient.nombre}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Button onClick={() => { setEmployeeModalData({ nombre: '', cuil: '', liquidaciones: [] }); setShowEmployeeModal(true); }} className="mb-3">Agregar Empleado</Button>
          <Table striped bordered hover>
            <thead><tr><th>ID</th><th>Nombre</th><th>CUIL</th><th>Acciones</th></tr></thead>
            <tbody>
              {selectedClient.empleados.map(empleado => (
                <tr key={empleado.id}>
                  <td>{empleado.id}</td><td>{empleado.nombre}</td><td>{empleado.cuil}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => { setEmployeeModalData(deepCopy(empleado)); setShowEmployeeModal(true); }}>Editar</Button>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleEmployeeDelete(empleado.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>}

      {/* Employee Add/Edit Modal */}
      {employeeModalData && <Modal show={showEmployeeModal} onHide={() => setShowEmployeeModal(false)} size="xl">
        <Modal.Header closeButton><Modal.Title>{employeeModalData.id ? 'Editar' : 'Agregar'} Empleado</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" value={employeeModalData.nombre} onChange={(e) => setEmployeeModalData({ ...employeeModalData, nombre: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>CUIL</Form.Label><Form.Control type="text" value={employeeModalData.cuil} onChange={(e) => setEmployeeModalData({ ...employeeModalData, cuil: e.target.value })} /></Form.Group>
          </Form>
          <hr />
          <h5>Liquidaciones</h5>
          <Button size="sm" onClick={() => { setLiquidationModalData({ periodo: '', sueldo_bruto: 0, descuentos: 0 }); setShowLiquidationModal(true); }} className="mb-3">Agregar Liquidación</Button>
          <Table striped bordered hover size="sm">
            <thead><tr><th>ID</th><th>Período</th><th>Sueldo Bruto</th><th>Descuentos</th><th>Acciones</th></tr></thead>
            <tbody>
              {employeeModalData.liquidaciones.map(liq => (
                <tr key={liq.id}>
                  <td>{liq.id}</td><td>{liq.periodo}</td><td>{liq.sueldo_bruto}</td><td>{liq.descuentos}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => { setLiquidationModalData(deepCopy(liq)); setShowLiquidationModal(true); }}>Editar</Button>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleLiquidationDelete(liq.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmployeeModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleEmployeeSave}>Guardar Cambios de Empleado</Button>
        </Modal.Footer>
      </Modal>}

      {/* Liquidation Add/Edit Modal */}
      {liquidationModalData && <Modal show={showLiquidationModal} onHide={() => setShowLiquidationModal(false)}>
        <Modal.Header closeButton><Modal.Title>{liquidationModalData.id ? 'Editar' : 'Agregar'} Liquidación</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Período</Form.Label><Form.Control type="text" placeholder="YYYY-MM" value={liquidationModalData.periodo} onChange={(e) => setLiquidationModalData({ ...liquidationModalData, periodo: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Sueldo Bruto</Form.Label><Form.Control type="number" value={liquidationModalData.sueldo_bruto} onChange={(e) => setLiquidationModalData({ ...liquidationModalData, sueldo_bruto: parseFloat(e.target.value) || 0 })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Descuentos</Form.Label><Form.Control type="number" value={liquidationModalData.descuentos} onChange={(e) => setLiquidationModalData({ ...liquidationModalData, descuentos: parseFloat(e.target.value) || 0 })} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLiquidationModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleLiquidationSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>}

    </div>
  );
};

export default Admin;