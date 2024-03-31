import React, { useState } from 'react';
import { firestore, auth } from '../firebase';
import './css/CadastroProduto.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DataGridProduto from './DataGridProduto'
import { collection, addDoc } from 'firebase/firestore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { format } from 'date-fns';

const CadastrarProduto = () => {

    const [nomeProduto, setNomeProduto] = useState('');
    const [descProduto, setDescProduto] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const handleChange = (event) => {
        setUnidadeMedida(event.target.value);
    };

    function validation() {
        if (nomeProduto === null || nomeProduto === "") {
            alert("Nome produto inválido")
            return false
        }

        if (quantidade === null || quantidade === "") {
            alert("Quantidade ou Medida inválido")
            return false
        }
        return true;
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!validation()) {
            return;
        }
        try {
            const produtosCollection = collection(firestore, 'produtos');
            const estoquesCollection = collection(firestore, 'estoques');

            const now = new Date();
            const dataNowFormatada = format(now, 'dd/MM/yyyy HH:mm:ss');

            const produto = {
                nomeProduto: nomeProduto,
                descProduto: descProduto,
                quantidade: quantidade,
                unidadeMedida: unidadeMedida,
                dataCadastro: dataNowFormatada,
                dataAtualizacao: null,
                userAgent: auth.currentUser.email
            };

            await addDoc(produtosCollection, produto);

            setDescProduto('')
            setNomeProduto('')
            setUnidadeMedida('')
            alert("produto cadastrado")
            console.log('Produto cadastrado com sucesso! ID do documento:');

        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error.message);
        }
    }

    const renderInputForUnit = () => {
        switch (unidadeMedida) {
            case 'UN': // Unidade
                return <TextField value={quantidade} label="Quantidade" variant="outlined" onChange={(e) => setQuantidade(e.target.value)} />;
            case 'CX': // Caixa
                return <TextField value={quantidade} label="Quantidade de Caixas" variant="outlined" onChange={(e) => setQuantidade(e.target.value)} />;
            case 'KG': // Quilograma
                return <TextField value={quantidade} label="Peso em Quilogramas" variant="outlined" onChange={(e) => setQuantidade(e.target.value)} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Box id="boxCadastroProduto"
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <h4>Cadastrar Produto</h4>
                <TextField
                    label="Nome Produto"
                    variant="outlined"
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                />
                <TextField
                    label="Descrição Produto"
                    variant="outlined"
                    value={descProduto}
                    onChange={(e) => setDescProduto(e.target.value)}
                />
                <InputLabel id="demo-simple-select-label" >Unidade Medida</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="select-product"
                    value={unidadeMedida}
                    label="UnidadeMedida"
                    onChange={handleChange}
                >
                    <MenuItem value="UN">Unidade</MenuItem>
                    <MenuItem value="CX">Caixa</MenuItem>
                    <MenuItem value="KG">Quilograma</MenuItem>
                </Select>

                {renderInputForUnit()}

                <Button id="buttonCadastrarProduto" type="submit" onClick={onSubmit} variant="contained">Cadastrar</Button>
            </Box>
            <DataGridProduto />
        </div>
    )
}

export default CadastrarProduto;
