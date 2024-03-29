import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import firestore from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

import './css/CadastroProduto.css';

const columns = [
  {
    field: 'nomeProduto',
    isCellEditable: false,
    disableColumnSelector: false,
    headerName: 'Produto',
    width: 190
  },
  {
    field: 'preco', // Não use estoque.quantidade aqui
    headerName: 'Preço',
    width: 100,
    type: 'number'
  },
  {
    field: 'quantidade', // Não use estoque.quantidade aqui
    headerName: 'Quantidade',
    width: 142,
    type: 'number'
  },
  {
    field: 'unidadeMedida',
    headerName: 'Medida',
    width: 115
  }, {
    field: 'descProduto',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'Descrição',
    width: 150
  }
];

export default function DataGridProduto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [filtroNomeProduto, setFiltroNomeProduto] = useState('');

  useEffect(() => {
    const fetchProdutos = () => {
      try {
        const produtosCollection = collection(firestore, 'produtos');
        let q = produtosCollection;

        if (filtroNomeProduto) {
          const regex = new RegExp(filtroNomeProduto, 'i');
          q = query(produtosCollection, orderBy('nomeProduto'));

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const filteredProdutos = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (regex.test(data.nomeProduto)) {
                filteredProdutos.push({ id: doc.id, ...data });
              }
            });
            setProdutos(filteredProdutos);
          });

          return () => unsubscribe();
        } else {
          const unsubscribe = onSnapshot(produtosCollection, (snapshot) => { // Substituir getDocs por onSnapshot
            const produtosData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProdutos(produtosData);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, [filtroNomeProduto]);

  const handleFiltroNomeChange = (event) => {
    setFiltroNomeProduto(event.target.value);
  };

  const handleLimparFiltro = () => {
    setFiltroNomeProduto('');
  };

  const handleProductClick = (id) => {
    navigate(`/atualizarProduto/${id}`);
  };

  return (
    <Box id="dataGridListProduto" sx={{ height: '100%', width: '100%' }}>
      <h4>Produtos:</h4>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField className="filterNomeProduto"
          label="Filtrar por nome do produto"
          variant="outlined"
          value={filtroNomeProduto}
          onChange={handleFiltroNomeChange}
        />

        {filtroNomeProduto && (
          <IconButton onClick={handleLimparFiltro} size="small">
            <ClearIcon />
          </IconButton>
        )}
      </div>
      <DataGrid
        isCellEditable={() => false}
        disableColumnSelector
        rows={produtos}
        columns={columns.map((column) => ({
          ...column,
          renderCell: (params) => (
            <div style={{ cursor: 'pointer' }} onClick={() => handleProductClick(params.row.id)}>
              {params.value}
            </div>
          ),
        }))}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
