import { Box, Typography } from '@mui/material';

export const Logo = ({ mode = "light" }: { mode?: "light" | "dark" | "mixed" }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FA8231" />
                        <stop offset="100%" stopColor="#E62A4D" />
                    </linearGradient>
                </defs>
                {/* Stylized 'C' shape matching the uploaded logo structure */}
                <path d="M 65 15 A 40 40 0 1 0 75 85 L 75 60 A 15 15 0 1 1 52 38 Z" fill="url(#logoGrad)" />
                {/* Floating dot */}
                <circle cx="75" cy="38" r="10" fill="#FA8231" />
            </svg>
            <Typography variant="h6" sx={{
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: mode === "light" ? "#1e293b" : (mode === "mixed" ? "#E62A4D" : "#1e293b"),
                fontFamily: "'Inter', sans-serif"
            }}>
                Community Platform
            </Typography>
        </Box>
    );
};
