import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import firestore from '../firebase';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';

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
    field: 'estoque', // Não use estoque.quantidade aqui
    headerName: 'Quantidade',
    width: 142,
    type: 'number',
    renderCell: (params) => (
      <div>{params.row.estoque ? params.row.estoque.quantidade : ''}</div>
    )
  },
  {
    field: 'unidadeMedida', // Adicionei uma nova coluna para exibir a quantidade do estoque
    headerName: 'Medida',
    width: 115
  }, {
    field: 'descProduto',
    disableColumnSelector: false,
    isCellEditable: false,
    headerName: 'Descrição',
    width: 132
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
          q = query(produtosCollection, orderBy('nomeProduto'));

          const unsubscribe = onSnapshot(q, async (snapshot) => {
            const promises = snapshot.docs.map(async (doc) => {
              const data = doc.data();
              if (regex.test(data.nomeProduto)) {
                const quantidadeEstoque = await getEstoque(doc.id);
                const estoque = { quantidade: quantidadeEstoque };
                return { id: doc.id, ...data, estoque: estoque };
              }
              return null;
            });
            const produtosWithEstoque = await Promise.all(promises);
            setProdutos(produtosWithEstoque.filter((produto) => produto !== null));
          });

          return () => unsubscribe();
        } else {
          const unsubscribe = onSnapshot(q, async (snapshot) => {
            const promises = snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const quantidadeEstoque = await getEstoque(doc.id);
              const estoque = { quantidade: quantidadeEstoque };
              return { id: doc.id, ...data, estoque: estoque };
            });
            const produtosWithEstoque = await Promise.all(promises);
            setProdutos(produtosWithEstoque);
            console.log(produtosWithEstoque)
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

  const getEstoque = async (id) => {
    try {
      const estoqueDbRef = collection(firestore, 'estoques');
      const filtro = where('produtoId', '==', id);
      const estoqueSnapshot = await getDocs(query(estoqueDbRef, filtro));

      if (!estoqueSnapshot.empty) {
        // Se houver registros de estoque, retornar a quantidade do primeiro registro
        return estoqueSnapshot.docs[0].data().quantidade;
      } else {
        // Se não houver registros de estoque, retornar 0
        return 0;
      }
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      return null;
    }
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
