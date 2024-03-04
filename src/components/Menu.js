import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerMenu from './DrawerMenu';

const Menu = ({ user, signOut }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    function removerCaracteresAposArroba(str) {
        var posicaoArroba = str.indexOf('@');

        if (posicaoArroba !== -1) {
            // Se o "@" for encontrado na string
            return str.substring(0, posicaoArroba + 0); // +1 para incluir o próprio "@"
        } else {
            return str;
        }
    }

    const estiloDoUsuarioLogadoFinalTela = {
        display: 'inline-block',
        position: 'fixed',
        top: '2%',
        right: '1%'
    };

    const estiloButtonDeslogar = {
        display: 'inline-block',
        position: 'fixed',
        top: '4.5%',
        right: '1%'
    };

    return (
        <div>
            {user ? (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>

                        <div style={{ display: 'inline-block' }}>
                            <h4>CamilaFrios</h4>
                        </div>
                        <div style={estiloDoUsuarioLogadoFinalTela}>
                            {removerCaracteresAposArroba(user.email)}

                        </div>
                        <div style={estiloButtonDeslogar}>
                            <button onClick={signOut}>Sair</button>
                        </div>




                    </Toolbar>
                    <DrawerMenu open={drawerOpen} onClose={handleDrawerClose} user={user} />
                </AppBar>

            ) : (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h10" component="div" sx={{ flexGrow: 1 }}>
                            CamilaFrios {user ? ("Vendedor") : ("")}
                        </Typography>
                    </Toolbar>
                    <DrawerMenu open={drawerOpen} onClick={handleDrawerClose} onClose={handleDrawerClose} user={user} />
                </AppBar>
            )}

        </div>
    )
}

export default Menu;    