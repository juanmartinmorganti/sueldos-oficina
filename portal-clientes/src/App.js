import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaClientes from './components/ListaClientes';
import DetalleCliente from './components/DetalleCliente';
import DetalleLiquidacion from './components/DetalleLiquidacion';
import Admin from './components/Admin';
import initialData from './data.json';

function App() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('data');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  const handleDataUpload = (newData) => {
    setData(newData);
  };

  return (
    <Router>
      <div className="container mt-4">
        <nav className="mb-3">
          <Link to="/" className="btn btn-primary me-2">Clientes</Link>
          <Link to="/admin" className="btn btn-secondary">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ListaClientes clientes={data.clientes} onDataUpload={handleDataUpload} />} />
          <Route path="/cliente/:id" element={<DetalleCliente clientes={data.clientes} />} />
          <Route path="/cliente/:clienteId/empleado/:empleadoId" element={<DetalleLiquidacion clientes={data.clientes} />} />
          <Route path="/admin" element={<Admin data={data} setData={setData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;