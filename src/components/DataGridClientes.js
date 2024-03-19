import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import './css/CadastroClientes.css';
import properties from './Properties';
import UseFirebaseAuth from './UseFirebaseAuth';



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
  const [email, setEmail] = useState(null);
  const { user } = UseFirebaseAuth();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
    

        if (!email) {
          setEmail(user.email);
        }
        const unsubscribe = getClientesRealTime();
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchUsers();
  }, [email, user]);

  const getClientesRealTime = (emailparametro) => {
    const clientesCollection = collection(firestore, 'clientes');

    let querySnapshot = null;
    if (properties.userAdmin.includes(user.email)) {
      querySnapshot = onSnapshot(clientesCollection, (snapshot) => { // Substituir getDocs por onSnapshot
        const clientesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      });
    } else {
      const filtro = where('userAgent', '==', user.email);
      querySnapshot = onSnapshot(query(clientesCollection, filtro), (snapshot) => { // Substituir getDocs por onSnapshot
        const clientesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      });
    }

    return () => querySnapshot();
  };

  



  const dynamicColumns = properties.userAdmin.includes(email)
    ? [
      ...columns,
      {
        field: 'userAgent',
        headerName: 'Vendedor',
        width: 150,
        valueGetter: (params) => {
          const userAgent = params.row.userAgent;
          const firstPart = userAgent.split('@')[0];
          return firstPart;
        },
      },
    ]
    : [...columns];

  return (

    <Box id="dataGridListCliente" sx={{ height: '100% ', width: '100%' }}>
      <h4>Clientes:</h4>
      <DataGrid
        isCellEditable={() => false}
        disableColumnSelector
        rows={clientes}
        columns={dynamicColumns}
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