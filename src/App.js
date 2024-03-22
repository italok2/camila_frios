import React,{useEffect, useState} from 'react';
import { getDatabase, ref, onValue, off } from "firebase/database";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserStatus from './components/UserStatus';
import CadastrarVendedor from './components/CadastrarVendedor';
import Pedido from './components/Pedido';
import CadastroProduto from './components/CadastroProduto';
import DataGridProduto from './components/DataGridProduto';
import CadastroClientes from './components/CadastroClientes';


function App() {


  const [reloadCompleted, setReloadCompleted] = useState(false);

  useEffect(() => {
    const database = getDatabase();
    const reloadRef = ref(database, 'reloadTrigger');

    // Adiciona um listener para monitorar as mudanças no nó reloadTrigger
    onValue(reloadRef, (snapshot) => {
      const reloadValue = snapshot.val();
      console.log("reloadValue" + reloadValue)
      console.log("reloadCompleted" + reloadCompleted)
      if (reloadValue && !reloadCompleted) {
        console.log("reiniciando")
        setReloadCompleted(true); // Define reloadCompleted como true para evitar múltiplos recarregamentos
         window.location.reload();
      }
    });

    return () => {
      console.log("off")
      reloadRef.off;
    };
  }, [reloadCompleted]);

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
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;