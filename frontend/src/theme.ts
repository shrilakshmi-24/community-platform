import { createTheme } from '@mui/material/styles';

// Modern Premium Theme
// Primary: Vibrant Red (Brand gradient end)
// Secondary: Bright Orange (Brand gradient start)
// Background: Soft Warm White

const theme = createTheme({
    palette: {
        primary: {
            main: '#E62A4D',
            light: '#FF5E78',
            dark: '#B01030',
            contrastText: '#fff',
        },
        secondary: {
            main: '#FA8231',
            light: '#FFB166',
            dark: '#C05609',
            contrastText: '#fff',
        },
        background: {
            default: '#f8f9fa',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '-1px' },
        h2: { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.5px' },
        h3: { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.5px' },
        h4: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
        h6: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
        button: { fontFamily: "'Inter', sans-serif", fontWeight: 700, textTransform: 'none' },
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
                        boxShadow: '0 8px 20px -6px rgba(230, 42, 77, 0.4)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #E62A4D 0%, #B01030 100%)',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#E62A4D',
                    color: '#E62A4D',
                    '&:hover': {
                        backgroundColor: 'rgba(230, 42, 77, 0.04)',
                    }
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
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', // Soft shadow
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px -10px rgba(250, 130, 49, 0.15)',
                        borderColor: 'rgba(250, 130, 49, 0.3)'
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.05)',
                },
                rounded: {
                    borderRadius: 20,
                }
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    borderRadius: 8,
                },
                filledPrimary: {
                    background: 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)',
                }
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
                    color: '#0f172a'
                },
                colorPrimary: {
                    background: 'linear-gradient(135deg, #FA8231 0%, #E62A4D 100%)',
                    color: '#ffffff'
                }
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#ffffff',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#f8fafc',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 0 0 3px rgba(250, 130, 49, 0.1)',
                        },
                    },
                }
            }
        }
    },
});

export default theme;
