import React from 'react';
import { renderToString } from 'react-dom/server';
import { GridLegacy as Grid } from '@mui/material';

console.log('GridLegacy type:', typeof Grid);

try {
  const html = renderToString(<Grid item xs={12}>Hello</Grid>);
  console.log('HTML:', html);
} catch (e) {
  console.error("Render Error:", e);
}
