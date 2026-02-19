import { createTheme } from '@mui/material/styles';

// Modern Premium Theme
// Primary: Deep Maroon (Brand)
// Secondary: Gold/Ochre (Accent)
// Background: Soft Warm White

const theme = createTheme({
    palette: {
        primary: {
            main: '#8B2635',
            light: '#B44C5C',
            dark: '#5A121E',
            contrastText: '#fff',
        },
        secondary: {
            main: '#CD853F',
            light: '#E6A972',
            dark: '#965A23',
            contrastText: '#fff',
        },
        background: {
            default: '#FAFAFA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#2D2D2D',
            secondary: '#555555',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
        h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        button: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, textTransform: 'none' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50, // Pill shape
                    padding: '8px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(139, 38, 53, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #8B2635 0%, #6B1F2A 100%)',
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)', // Soft shadow
                    border: '1px solid rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px -12px rgba(139, 38, 53, 0.12)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                },
            },
        },
    },
});

export default theme;
