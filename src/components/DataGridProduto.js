import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState, useEffect } from 'react';
import firestore from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import './css/CadastroProduto.css';

const columns = [
  {
    field: 'nomeProduto',
    isCellEditable: false,
    disableColumnSelector: false,
    headerName: 'Produto',
    width: 180,
    editable: true,
  },
  {
    field: 'descProduto',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'Descrição',
    width: 150,
    editable: true,
  }
];

export default function DataGridProduto() {
  const [produtos, setProdutos] = useState([]);
  const [filtroNomeProduto, setFiltroNomeProduto] = useState('');

  useEffect(() => {
    const fetchProdutos = () => {
      try {
        const produtosCollection = collection(firestore, 'produtos');
        let q = produtosCollection;

        if (filtroNomeProduto) {
          const regex = new RegExp(filtroNomeProduto, 'i');
          q = query(produtosCollection, where('nomeProduto', '>=', filtroNomeProduto), orderBy('nomeProduto'));

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
          const unsubscribe = onSnapshot(q, (snapshot) => {
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

  return (
    <Box id="dataGridListProduto" sx={{ height: '100%', width: '100%' }}>
      <h4>Produtos:</h4>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input id="filterNomeProduto" type="text" value={filtroNomeProduto} onChange={handleFiltroNomeChange} placeholder="Filtrar por nome do produto" />
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
        columns={columns}
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
