import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Button, Typography, Container, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import firestore from '../firebase';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(() => ({
    marginTop: '1rem',
}));

const StyledForm = styled('form')(() => ({
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
}));

const salvarHistoricoProduto = async (produtoHistorico) => {
    try {
        const historicoRef = collection(firestore, 'produtosHistorico');
        await addDoc(historicoRef, produtoHistorico);
        console.log('Histórico do produto salvo com sucesso:', produtoHistorico);
    } catch (error) {
        console.error('Erro ao salvar o histórico do produto:', error);
    }
};

const AtualizarProduto = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [nomeProduto, setNomeProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [descProduto, setDescProduto] = useState('');
    const [dataCadastro, setDataCadastro] = useState('');
    const [dataAtualizacao, setDataAtualizacao] = useState(null);
    const [userAgent, setUserAgent] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(firestore, 'produtos', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProduto({ id: docSnap.id, ...data });
                    setNomeProduto(data.nomeProduto);
                    setQuantidade(data.quantidade);
                    setUnidadeMedida(data.unidadeMedida);
                    setDescProduto(data.descProduto);
                    setDataCadastro(data.dataCadastro);
                    setDataAtualizacao(data.dataAtualizacao);
                    setUserAgent(data.userAgent);
                } else {
                    console.log('Produto não encontrado!');
                }
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
            }
        };

        fetchData();

        return () => {
            // Clean-up code, if needed
        };
    }, [id]);

    const handleUpdateProduct = async () => {
        try {
            const now = new Date();
            const dataNowFormatada = format(now, 'dd/MM/yyyy HH:mm:ss');
    
            setDataAtualizacao(dataNowFormatada); // Atualize o estado de dataAtualizacao

            if (produto) {
                produto.dataAtualizacao = dataNowFormatada
                await salvarHistoricoProduto(produto);
                setProduto(null)
                navigate("/cadastrarproduto")
            }
   
            const docRef = doc(firestore, 'produtos', id);
            await updateDoc(docRef, {
                nomeProduto,
                quantidade,
                unidadeMedida,
                descProduto,
                dataAtualizacao: dataNowFormatada
            });
            alert("Produto atualizado com sucesso!");
            console.log('Produto atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };
    
    
    if (!produto) {
        return <div>Carregando...</div>;
    }

    return (
        <StyledContainer>
            <Typography variant="h5" gutterBottom>
                Atualizar Produto: {produto.nomeProduto}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Data de Cadastro: {dataCadastro}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Última Atualização: {dataAtualizacao}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Atualizado por: {userAgent}
            </Typography>
            <StyledForm>
                <TextField
                    label="Nome do Produto"
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                />
                <TextField
                    label="Quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                />
                <Select
                    value={unidadeMedida}
                    onChange={(e) => setUnidadeMedida(e.target.value)}
                    label="Unidade de Medida"
                >

                    <MenuItem value="UN">Unidade</MenuItem>
                    <MenuItem value="CX">Caixa</MenuItem>
                    <MenuItem value="KG">Quilograma</MenuItem>
                </Select>
                <TextField
                    label="Descrição"
                    value={descProduto}
                    onChange={(e) => setDescProduto(e.target.value)}
                    multiline
                    rows={1}
                />
                <Button variant="contained" onClick={handleUpdateProduct}>
                    Atualizar Produto
                </Button>
            </StyledForm>
        </StyledContainer>
    );
};

export default AtualizarProduto;
