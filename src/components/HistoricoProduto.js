import React, { useEffect, useState } from 'react';
import firestore from '../firebase';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';

export default function HistoricoProduto() {
    const [filtroNomeProduto, setFiltroNomeProduto] = useState('');
    const [idProduto, setIdProduto] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [historicoProdutos, setHistoricoProdutos] = useState([]);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const produtosCollection = collection(firestore, 'produtos');
                let q = produtosCollection;

                if (filtroNomeProduto) {
                    const regex = new RegExp(filtroNomeProduto, 'i');
                    q = query(produtosCollection, orderBy('nomeProduto'));
                    const snapshot = await getDocs(q);
                    const filteredProdutos = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(data => !filtroNomeProduto || regex.test(data.nomeProduto));
                    setProdutos(filteredProdutos);
                } else {
                    setProdutos([])
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        const fetchHistoricoProdutos = async () => {
            try {
                if (idProduto) {
                    const historicoProdutosCollection = collection(firestore, 'produtosHistorico');
                    const q = query(historicoProdutosCollection, where('id', '==', idProduto));
                    const snapshot = await getDocs(q);
                    const historicoProdutosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setHistoricoProdutos(historicoProdutosData);
                    console.log(historicoProdutosData)
                }
            } catch (error) {
                console.error('Erro ao buscar histórico de produtos:', error);
            }
        };

        fetchProdutos();
        fetchHistoricoProdutos();

    }, [filtroNomeProduto, idProduto]);

    const handleProdutoChange = (event, value) => {
        if (value) {
            setFiltroNomeProduto(value.nomeProduto);
            setIdProduto(value.id)
        } else {
            setFiltroNomeProduto('');
            setIdProduto('')
            setHistoricoProdutos([])
        }
    };

    const handleInputChange = (event, value) => {
        setFiltroNomeProduto(value);
    };

    return (
        <div>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={produtos}
                getOptionLabel={(option) => option.nomeProduto}
                sx={{ width: '100%', marginTop: 1 }}
                onChange={handleProdutoChange}
                onInputChange={handleInputChange}
                renderInput={(params) => <TextField {...params} label="Produto" />}
            />
            <div style={{ height: 400, width: '100%', marginTop: 10 }}>
                <DataGrid
                    isCellEditable={() => false}
                    disableColumnSelector
                    rows={historicoProdutos}
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
                    getRowId={(row) => row.dataAtualizacao} 
                />
            </div>
        </div>
    );
}

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
        width: 106,
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
    },
    {
        field: 'userAgent',
        disableColumnSelector: false,
        isCellEditable: false,
        headerName: 'Usuário',
        width: 150
    },
    {
        field: 'dataAtualizacao',
        disableColumnSelector: false,
        isCellEditable: false,
        headerName: 'Atualizado',
        width: 150
    },
    {
        field: 'descProduto',
        disableColumnSelector: false,
        isCellEditable: false,
        headerName: 'Descrição',
        width: 150
    }
];