import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import './css/CadastroClientes.css';
import properties from './Properties';
import UseFirebaseAuth from './UseFirebaseAuth';
import { Box, Card, CardContent, Typography, Pagination, Grid } from '@mui/material';

const ITEMS_PER_PAGE = 8;

export default function DataGridClientes() {
  const [clientes, setClientes] = useState([]);
  const [email, setEmail] = useState(null);
  const [page, setPage] = useState(1);
  const { user } = UseFirebaseAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!email) {
          setEmail(user.email);
        }
        const unsubscribe = getClientesRealTime();
        return unsubscribe;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchUsers();
  }, [email, user]);

  const getClientesRealTime = () => {
    const clientesCollection = collection(firestore, 'clientes');

    let querySnapshot = null;
    if (properties.userAdmin.includes(user.email)) {
      querySnapshot = onSnapshot(clientesCollection, (snapshot) => {
        const clientesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      });
    } else {
      const filtro = where('userAgent', '==', user.email);
      querySnapshot = onSnapshot(query(clientesCollection, filtro), (snapshot) => {
        const clientesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      });
    }

    return () => querySnapshot();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderClientes = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return clientes.slice(startIndex, endIndex).map((cliente) => (
      <Grid item key={cliente.id} xs={12} sm={6} md={4} lg={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {cliente.nomeCliente}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contato: {cliente.contato}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CEP: {cliente.cep}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              N.º: {cliente.numLogradouro}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data Cadastro: {cliente.dataCadastro}
            </Typography>
            {properties.userAdmin.includes(email) && (
              <Typography variant="body2" color="text.secondary">
                Vendedor: {cliente.userAgent.split('@')[0]}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  const pageCount = Math.ceil(clientes.length / ITEMS_PER_PAGE);

  return (
    <Box id="dataGridListCliente" sx={{ height: '100%', width: '100%' }}>
      <h4>Clientes:</h4>
      <Grid container spacing={2}>
        {renderClientes()}
      </Grid>
      <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        size="large"
        sx={{ marginTop: '20px', alignSelf: 'center' }}
      />
    </Box>
  );
}
