import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import firestore from '../firebase';
import './css/CadastroVendedor.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import DataGridVendedor from './DataGridVendedor'
import { collection, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import properties from './Properties';

const CadastrarVendedor = () => {
    const navigate = useNavigate();
    console.log("ITALOK 1")
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(true);

    const validateEmail = (inputEmail) => {
        // Expressão regular para validar e-mails
        if (inputEmail != "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Atualiza o estado isEmailValid com base na validação
            setIsEmailValid(emailRegex.test(inputEmail));
        }

    };
    const handleBlur = () => {
        // Valida o e-mail quando o usuário sai do campo
        validateEmail(email);
    };


    const onSubmit = async (e) => {
        e.preventDefault()

        if ((email == null || email == "") || (password == null || password == "")) {
            alert("Email ou Senha inválido")
            return null
        }

        const currentUserEmail = auth.currentUser.email

        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Signed in
                const usuariosCollection = collection(firestore, 'usuarios');
                const userDoc = doc(usuariosCollection, email);
                setDoc(userDoc, {
                    password: password,
                    email: email.toLowerCase(),
                });

                alert("Vendedor Cadastrado!")
                signInWithEmailAndPassword(auth, currentUserEmail, properties.password);
                setEmail('')
                setPassword('')
                navigate("/cadastrovendedor")
            })
            .catch((error) => {
                signInWithEmailAndPassword(auth, currentUserEmail, properties.password);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                if (errorMessage.includes("invalid")) {
                    alert("Email inválido")
                    return null
                } else if (errorMessage.includes("Password should be at least 6 characters")) {
                    alert("Senha precisa ter 6 caracteres")
                    return null
                } else if (errorMessage.includes("auth/email-already-in-use")) {
                    alert("Vendedor já cadastrado")
                    return null
                }
                else {
                    alert("Erro ao cadastrar vendedor")
                    navigate("/cadastrovendedor")
                }
            });

    }

    return (

        <div>
            <Box id="boxCadastroVendedor"
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <h3>Cadastro Vendedor</h3>
                <TextField
                    label="E-mail"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                    error={!isEmailValid}
                    helperText={!isEmailValid ? 'E-mail inválido' : ''}
                />
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Senha</InputLabel>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Button id="buttonCadastrarVendedor" type="submit" onClick={onSubmit} variant="contained">Cadastrar</Button>
            </Box>
            <DataGridVendedor />
        </div>
    )
}

export default CadastrarVendedor
