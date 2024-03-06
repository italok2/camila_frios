import React, { useState } from 'react';
import { firestore, auth } from '../firebase';
import './css/CadastroClientes.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DataGridClientes from './DataGridClientes'
import { collection, addDoc } from 'firebase/firestore';
import InputMask from 'react-input-mask';
import { format } from 'date-fns';

const CadastroClientes = () => {

    const [nomeCliente, setNomeCliente] = useState('')
    const [contato, setContato] = useState('');
    const [cep, setCep] = useState('');
    const [numLogradouro, setNumLogradouro] = useState('');

    const [isNomeClienteValid, setIsNomeClienteValid] = useState(true);

    const validateNomeCliente = (inputNomeCliente) => {

        if (inputNomeCliente == null || inputNomeCliente == "") {
            setIsNomeClienteValid(false);
        } else {
            setIsNomeClienteValid(true);
        }

    };
    const handleBlur = () => {
        // Valida o nome cliente quando o usuário sai do campo
        validateNomeCliente(nomeCliente);

    };

    const onSubmit = async (e) => {
        e.preventDefault()

        if (nomeCliente == null || nomeCliente == "") {
            alert("Dados inválidos")
            setIsNomeClienteValid(false);
            return null
        }

        try {
            const clientesCollection = collection(firestore, 'clientes');
            const now = new Date();
            const dataFormatada = format(now, 'dd/MM/yyyy HH:mm:ss');

            const cliente = {
                nomeCliente: nomeCliente,
                contato: contato,
                cep: cep,
                numLogradouro: numLogradouro,
                dataCadastro: dataFormatada,
                userAgent: auth.currentUser.email

            };

            console.log(cliente)

            const docRef = await addDoc(clientesCollection, cliente);

            setNomeCliente('')
            setContato('')
            setCep('')
            setNumLogradouro('')
            alert("Cliente cadastrado")
            console.log('Cliente cadastrado com sucesso! ID do documento:', docRef.id);

        } catch (error) {
            console.error('Erro ao cadastrar o Cliente:', error.message);
        }

    }

    return (

        <div>
            <Box id="boxCadastroCliente"
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <h4>Cadastrar Cliente</h4>
                <TextField
                    label="Nome Cliente"
                    variant="outlined"
                    value={nomeCliente}
                    onBlur={handleBlur}
                    error={!isNomeClienteValid}
                    helperText={!isNomeClienteValid ? 'Nome inválido' : ''}
                    onChange={(e) => setNomeCliente(e.target.value)}
                />

                <InputMask
                    mask="(99) 99999-9999"
                    maskChar="_"
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    )}
                </InputMask>
                <InputMask
                    mask="99999-999"
                    maskChar="_"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            label="Cep"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    )}
                </InputMask>
                <TextField
                    label="Número"
                    variant="outlined"
                    value={numLogradouro}
                    onChange={(e) => setNumLogradouro(e.target.value)}
                />
                <Button id="buttonCadastrarCliente" type="submit" onClick={onSubmit} variant="contained">Cadastrar</Button>
            </Box>
            <DataGridClientes/>
        </div>
    )
}

export default CadastroClientes