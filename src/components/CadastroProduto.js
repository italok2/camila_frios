import React, { useState } from 'react';
import firestore from '../firebase';
import './css/CadastroProduto.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DataGridProduto from './DataGridProduto'
import { collection, addDoc } from 'firebase/firestore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const CadastrarProduto = () => {

    const [nomeProduto, setNomeProduto] = useState('')
    const [descProduto, setDescProduto] = useState('');
    const [preco, setPreco] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
      };

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const produtosCollection = collection(firestore, 'produtos');

            const produto = {
                nomeProduto: nomeProduto,
                descProduto: descProduto,
                preco: preco
            };

            // Adiciona o documento à coleção 'produtos'
            const docRef = await addDoc(produtosCollection, produto);

            setDescProduto('')
            setNomeProduto('')
            setPreco('')
            alert("produto cadastrado")
            console.log('Produto cadastrado com sucesso! ID do documento:', docRef.id);

        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error.message);
        }

    }

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

                <InputLabel id="demo-simple-select-label">Unidade Medida</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="select-product"
                    value={unidadeMedida}
                    label="UnidadeMedida"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Unidade</MenuItem>
                    <MenuItem value={1}>Caixa</MenuItem>
                    <MenuItem value={0}>Kilograma</MenuItem>
                </Select>
                <Button id="buttonCadastrarProduto" type="submit" onClick={onSubmit} variant="contained">Cadastrar</Button>
            </Box>
            <DataGridProduto />
        </div>
    )
}

export default CadastrarProduto