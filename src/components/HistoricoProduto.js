import React, { useEffect, useState } from 'react';
import firestore from '../firebase';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';

export default function HistoricoProduto() {
    const [filtroNomeProduto, setFiltroNomeProduto] = useState('');
    const [idProduto, setIdProduto] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [historicoProdutos, setHistoricoProdutos] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 5; // Define o número de registros por página como 5
    const [totalPages, setTotalPages] = useState(0);

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
                    const totalPages = Math.ceil(historicoProdutosData.length / pageSize);
                    setTotalPages(totalPages);
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    setHistoricoProdutos(historicoProdutosData.slice(startIndex, endIndex));
                }
            } catch (error) {
                console.error('Erro ao buscar histórico de produtos:', error);
            }
        };

        fetchProdutos();
        fetchHistoricoProdutos();

    }, [filtroNomeProduto, idProduto, page]); // Remova pageSize da lista de dependências, pois não é necessário

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

    const handlePageChange = (event, value) => {
        setPage(value);
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
            <div style={{ marginTop: 10 }}>
                {historicoProdutos.map((produto, index) => (
                    <Card key={index} style={{ marginBottom: 10 }}>
                        <CardContent>
                            <div>Atualizado: <span style={{ color: 'red' }}>{produto.dataAtualizacao}</span></div>
                            <div>Produto: {produto.nomeProduto}</div>
                            <div>Quantidade: {produto.quantidade}</div>
                            <div>Medida: {produto.unidadeMedida}</div>
                            <div>Usuário: {produto.userAgent}</div>

                            <div>Descrição: {produto.descProduto}</div>
                        </CardContent>
                    </Card>
                ))}
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    style={{ marginTop: 10, alignSelf: 'center' }}
                />
            </div>
        </div>
    );
}
