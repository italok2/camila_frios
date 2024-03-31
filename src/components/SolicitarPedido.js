import React, { useEffect, useState } from 'react';
import firestore from '../firebase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import './css/SolicitarPedido.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormControl, InputLabel } from '@mui/material';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';

dayjs.locale('pt-br');
// Novo componente para exibir as informações do produto
const ProductCard = ({ produto }) => {

    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [total, setTotal] = useState('');
    const [dataEntrega, setDataEntrega] = useState(null); // Alteração aqui: Inicializa com null para indicar que nenhum valor foi selecionado
    const [formaPagamento, setFormaPagamento] = useState('');

    const handleQuantidadeChange = (event) => {
        const newQuantidade = event.target.value;

        if (!newQuantidade || !/^[0-9]*\.?\d*$/.test(newQuantidade)) {
            setQuantidade('');
            event.target.value = ''
            return;
        }

        if (parseFloat(newQuantidade) < 0.1) {
            setQuantidade('');
            event.target.value = ''
            return;
        }
        if (parseFloat(newQuantidade) <= parseFloat(produto.quantidade)) {
            setQuantidade(newQuantidade);
        } else {
            setQuantidade(produto.quantidade);
        }
    };


    return (
        <div>
            <Card sx={{ marginTop: 1 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {produto.nomeProduto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Estoque: {produto.quantidade}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Medida: {produto.unidadeMedida}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {produto.descProduto}
                    </Typography>
                    {/* Adicione mais campos conforme necessário */}
                </CardContent>
            </Card>
            <div id="divSolicitarPedido">
                <TextField
                    type="number"
                    label="Quantidade"
                    value={quantidade}
                    onChange={handleQuantidadeChange}
                />
                <TextField disabled={true}
                    label="Unidade"
                    value={produto.unidadeMedida}
                />
                <TextField
                    type="number"
                    label="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                />
                <TextField
                    label="Total"
                    disabled={true}
                    value={parseFloat(quantidade * preco).toFixed(2)}
                    onChange={(e) => setTotal(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} dateLanguage="pt-br">
                    <DatePicker
                        value={dataEntrega}
                        onChange={(date) => setDataEntrega(date)}
                        disablePast label="Data de Entrega" />
                </LocalizationProvider>
                <FormControl>
                    <InputLabel id="forma-pagamento-label">Pagamento</InputLabel>
                    <Select
                        labelId="forma-pagamento-label"
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                        <MenuItem value="BOLETO">Boleto</MenuItem>
                        <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                        <MenuItem value="CARTAO_CREDITO">Crédito</MenuItem>
                        <MenuItem value="PIX">Pix</MenuItem>
                        <MenuItem value="CARTAO_DEBITO">Débito</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Button id="buttonAdicionarProduto" variant="contained">
                Adicionar Produto
            </Button>
        </div>
    );
};

const clientesCollection = collection(firestore, 'clientes');

const q = query(
    clientesCollection,
    where('userAgent', '==', 'abc@gmail.com')
);


export default function HistoricoProduto() {
    const [filtroNomeProduto, setFiltroNomeProduto] = useState('');
    const [filtroNomeCliente, setFiltroNomeCliente] = useState('');
    const [idProduto, setIdProduto] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);

    useEffect(() => {

        const fetchClientes = async () => {
            try {

                console.log(filtroNomeCliente)
                if (filtroNomeCliente) {
                    const regex = new RegExp(filtroNomeCliente, 'i');
                    const snapshot = await getDocs(q);
                    const filteredClientes = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(data => !filtroNomeCliente || regex.test(data.nomeCliente));
                    setClientes(filteredClientes);
                } else {
                    setClientes([])
                }
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

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
        fetchClientes();
        fetchProdutos();
    }, [filtroNomeProduto, idProduto, filtroNomeCliente, idCliente]);

    const handleProdutoChange = (event, value) => {
        if (value) {
            setFiltroNomeProduto(value.nomeProduto);
            setIdProduto(value.id);
            setProdutoSelecionado(value); // Atualiza o produto selecionado
        } else {
            setFiltroNomeProduto('');
            setIdProduto('');
            setProdutoSelecionado(null); // Limpa o produto selecionado
        }
    };

    const handleInputChange = (event, value) => {
        setFiltroNomeProduto(value);
    };

    const handleClienteChange = (event, value) => {
        if (value) {
            setFiltroNomeCliente(value.nomeCliente);
            setIdCliente(value.id);
            setClienteSelecionado(value); // Atualiza o produto selecionado
        } else {
            setFiltroNomeCliente('');
            setIdCliente('');
            setClienteSelecionado(null); // Limpa o produto selecionado
        }
    };

    const handleInputChangeCliente = (event, value) => {
        setFiltroNomeCliente(value);
    };

    return (
        <div>
            <h4>Solicitar Pedido</h4>
            <Autocomplete
                disablePortal
                id="combo-box-demo-cliente"
                options={clientes}
                getOptionLabel={(option) => option.nomeCliente}
                sx={{ width: '100%', marginTop: 1 }}
                onChange={handleClienteChange}
                onInputChange={handleInputChangeCliente}
                renderInput={(params) => <TextField {...params} label="Cliente" />}
            />
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
            {produtoSelecionado && <ProductCard produto={produtoSelecionado} />} {/* Renderiza o card do produto selecionado */}
        </div>
    );
}
