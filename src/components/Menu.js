import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerMenu from './DrawerMenu';
import {  useNavigate } from 'react-router-dom';

const Menu = ({ user }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
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

                        <Typography variant="h10" component="div" sx={{ flexGrow: 1 }}>
                            CamilaFrios - Administrador
                        </Typography>

                    </Toolbar>
                    <DrawerMenu open={drawerOpen} onClose={handleDrawerClose} user={user} />
                </AppBar>

            ) : (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h10" component="div" sx={{ flexGrow: 1 }}>
                            CamilaFrios - Vendedor
                        </Typography>
                    </Toolbar>
                    <DrawerMenu open={drawerOpen} onClick={handleDrawerClose} onClose={handleDrawerClose} user={user} />
                </AppBar>
            )}

        </div>
    )
}

export default Menu;