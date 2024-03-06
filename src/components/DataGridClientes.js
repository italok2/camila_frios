import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './css/CadastroClientes.css';
import properties from './Properties';


const columns = [
  {
    field: 'nomeCliente',
    isCellEditable: false,
    disableColumnSelector: false,
    headerName: 'Cliente',
    editable: true,
    width: 150
  },
  {
    field: 'contato',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'Contato',
    editable: true,
    width: 140
  }
  ,
  {
    field: 'cep',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'Cep',
    editable: true,
    width: 95
  },
  {
    field: 'numLogradouro',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'N.º',
    editable: true,
    width: 80
  },
  {
    field: 'dataCadastro',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'Data Cadastro',
    editable: true,
    width: 154
  }
];

export default function DataGridClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const clientesCollection = collection(firestore, 'clientes'); // Substitua 'usuarios' pelo nome da sua coleção
        let querySnapshot = null
        if (properties.userAdmin.includes(auth.currentUser.email)) {
          console.log("23123213")
          querySnapshot = await getDocs(clientesCollection);
        } else {
          console.log("italo")
          querySnapshot = await getDocs(clientesCollection);
        }

        const clientesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchUsers();
  }, []); // O array vazio como segundo argumento garante que o useEffect só é executado uma vez (na montagem do componente)

  return (

    <Box id="dataGridListCliente" sx={{ height: 400, width: '100%' }}>
      <h4>Clientes:</h4>
      <DataGrid
        isCellEditable={() => false}
        disableColumnSelector
        rows={clientes}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}