import React from 'react';
import UseFirebaseAuth from './UseFirebaseAuth';
import Menu from './Menu';
import Login from './Login';
import {  useNavigate } from 'react-router-dom';

const UserStatus = () => {

  const navigate = useNavigate();
  const { user, loading, signIn, signOut } = UseFirebaseAuth();

  if (loading) {
    return <p>Verificando status de autenticação...</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          {/* <p>Usuário autenticado: {user.email}</p>
          <button onClick={signOut}>Sair</button> */}
          <Menu user={user} />

        </div>
      ) : (
        
      <Login/>

        
      )}
    </div>
  );
};

export default UserStatus;
