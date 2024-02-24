import React from 'react';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserStatus from './components/UserStatus';
import CadastrarVendedor from './components/CadastrarVendedor';

// import CadastrarVendedores from './components/CadastrarVendedor';


function App() {

  return (
    <Router>
      <div>
        <section>
          <UserStatus />
          <Routes>
            <Route path="/cadastrovendedor" element={<CadastrarVendedor />} />
          </Routes>

        </section>
      </div>
    </Router>
  );
}

export default App;