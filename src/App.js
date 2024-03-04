import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserStatus from './components/UserStatus';
import CadastrarVendedor from './components/CadastrarVendedor';
import Pedido from './components/Pedido';
import CadastroProduto from './components/CadastroProduto';

function App() {

  return (
    <Router>
      <div>
        <section>
          <UserStatus />
          <Routes>
            <Route path="/cadastrovendedor" element={<CadastrarVendedor />} />
            <Route path="/pedidos" element={<Pedido />} />
            <Route path="/cadastrarProduto" element={<CadastroProduto />} />
    
          </Routes>

        </section>
      </div>
    </Router>
  );
}

export default App;