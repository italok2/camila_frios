import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserStatus from './components/UserStatus';
import CadastrarVendedor from './components/CadastrarVendedor';
import Pedido from './components/Pedido';
import CadastroProduto from './components/CadastroProduto';
import DataGridProduto from './components/DataGridProduto';
import CadastroClientes from './components/CadastroClientes';
import AtualizarProduto from './components/AtualizarProduto';
import HistoricoProduto from './components/HistoricoProduto';
import serviceWorkerRegistration from './serviceWorkerRegistration';

function App() {
  serviceWorkerRegistration();
  return (
    <Router>
      <div>
        <section>
          <UserStatus />
          <Routes>
            <Route path="/cadastrovendedor" element={<CadastrarVendedor />} />
            <Route path="/pedidos" element={<Pedido />} />
            <Route path="/cadastrarproduto" element={<CadastroProduto />} />
            <Route path="/listarprodutos" element={<DataGridProduto />} />
            <Route path="/cadastrarclientes" element={<CadastroClientes />} />
            <Route path="/atualizarProduto/:id" element={<AtualizarProduto />} />
            <Route path="/historicoprodutos" element={<HistoricoProduto />} />
            
    
          </Routes>

        </section>
      </div>
    </Router>
  );
}

export default App;