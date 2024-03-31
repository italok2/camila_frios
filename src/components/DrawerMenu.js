import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import properties from './Properties';

const DrawerMenu = ({ open, onClose, user }) => {
  if (user != null && properties.userAdmin.includes(user.email)) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        <List>
          <ListItem button component={Link} to="/pedidos">
            <ListItemText primary="Pedidos" />
          </ListItem>
          <ListItem button component={Link} to="/cadastrarproduto">
            <ListItemText primary="Produtos" />
          </ListItem>
          <ListItem button component={Link} to="/cadastrovendedor">
            <ListItemText primary="Vendedores" />
          </ListItem>
          <ListItem button component={Link} to="/cadastrarclientes">
            <ListItemText primary="Clientes" />
          </ListItem>
          <ListItem button component={Link} to="/historicoprodutos">
            <ListItemText primary="Historico" />
          </ListItem>
        </List>
      </Drawer>
    );
  } else {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        <List>
          <ListItem button component={Link} to="/solicitarpedido">
            <ListItemText primary="Solicitar Pedido" />
          </ListItem>
          <ListItem button component={Link} to="/listarprodutos">
            <ListItemText primary="Produtos" />
          </ListItem>
          <ListItem button component={Link} to="/cadastrarclientes">
            <ListItemText primary="Clientes" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
};

export default DrawerMenu;
