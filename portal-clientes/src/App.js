import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaClientes from './components/ListaClientes';
import DetalleCliente from './components/DetalleCliente';
import DetalleLiquidacion from './components/DetalleLiquidacion';
import data from './data.json';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ListaClientes clientes={data.clientes} />} />
          <Route path="/cliente/:id" element={<DetalleCliente clientes={data.clientes} />} />
          <Route path="/cliente/:clienteId/empleado/:empleadoId" element={<DetalleLiquidacion clientes={data.clientes} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;