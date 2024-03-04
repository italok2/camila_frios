import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import firestore from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './css/CadastroProduto.css';


const columns = [
  {
    field: 'nomeProduto',
    isCellEditable: false,
    headerName: 'Produto',
    width: 150,
    editable: true,
  },
  {
    field: 'descProduto',
    isCellEditable: false,
    headerName: 'Produto',
    width: 150,
    editable: true,
  }
];

export default function DataGridProduto() {
  const [produtos, setprodutos] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'produtos'); // Substitua 'usuarios' pelo nome da sua coleção
        const querySnapshot = await getDocs(usersCollection);
        const produtosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setprodutos(produtosData);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchUsers();
  }, []); // O array vazio como segundo argumento garante que o useEffect só é executado uma vez (na montagem do componente)

  return (
    <Box id="dataGridListProduto" sx={{ height: 400, width: '100%' }}>
      <DataGrid
        isCellEditable={() => false}
        rows={produtos}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}