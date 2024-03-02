import React, { useState } from 'react';
import firestore from '../firebase';
import './css/CadastroProduto.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DataGridProduto from './DataGridProduto'
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Produto from './class/Produto'

const CadastrarProduto = () => {
    const navigate = useNavigate();

    const [nomeProduto, setNomeProduto] = useState('')
    const [descProduto, setDescProduto] = useState('');



    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const produtosCollection = collection(firestore, 'produtos');
      
            const produto = {
              nomeProduto: nomeProduto,
              descProduto: descProduto
            };
      
            // Adiciona o documento à coleção 'produtos'
            const docRef = await addDoc(produtosCollection, produto);
      
            setDescProduto('')
            setNomeProduto('')
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
                <h3>Produto</h3>
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

                <Button id="buttonCadastrarProduto" type="submit" onClick={onSubmit} variant="contained">Cadastrar</Button>
            </Box>
            <DataGridProduto />
        </div>
    )
}

export default CadastrarProduto