import { createTheme } from '@mui/material/styles';

// Maroon color palette for Hindu community theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#8B2635',      // Deep maroon
            light: '#A0522D',     // Sienna brown
            dark: '#6B1F2A',      // Darker maroon
            contrastText: '#fff',
        },
        secondary: {
            main: '#A0522D',      // Sienna brown
            light: '#CD853F',     // Peru gold
            dark: '#8B4513',      // Saddle brown
            contrastText: '#fff',
        },
        background: {
            default: '#FDF5E6',   // Old lace
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(139, 38, 53, 0.3)',
                    },
                },
            },
        },
    },
});

export default theme;
