import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import firestore from '../firebase'; // Importe a instância do Firestore
import { collection, getDocs } from 'firebase/firestore';

const columns = [
  {
    field: 'email',
    headerName: 'Email',
    width: 315,
    editable: true,
  }
];

export default function DataGridVendedor(){
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
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={users}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 6,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
    );
  };