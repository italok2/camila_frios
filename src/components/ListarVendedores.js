// UserList.js
import React, { useState, useEffect } from 'react';
import firestore from '../firebase'; // Importe a instância do Firestore
import { collection, getDocs } from 'firebase/firestore';

const ListarVendedores = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'usuarios'); // Substitua 'usuarios' pelo nome da sua coleção
        const querySnapshot = await getDocs(usersCollection);
        const userData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []); // O array vazio como segundo argumento garante que o useEffect só é executado uma vez (na montagem do componente)

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>Email: {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListarVendedores;
