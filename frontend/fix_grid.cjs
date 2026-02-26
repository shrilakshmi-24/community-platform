const fs = require('fs');
const files = [
    'src/pages/admin/DonationManager.tsx',
    'src/pages/admin/ScholarshipManager.tsx',
    'src/pages/admin/AdminReports.tsx',
    'src/pages/admin/NewsletterEditor.tsx',
    'src/pages/admin/AdminOverview.tsx',
    'src/pages/admin/AdminHelpDesk.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix imports
    content = content.replace(/GridLegacy as Grid/g, 'Grid');

    // Remove `item` alone
    content = content.replace(/<Grid item /g, '<Grid ');

    // Match xs={X} sm={Y} md={Z}
    content = content.replace(/xs={(\d+)} sm={(\d+)} md={(\d+)}/g, 'size={{ xs: $1, sm: $2, md: $3 }}');

    // Match xs={X} md={Y}
    content = content.replace(/xs={(\d+)} md={(\d+)}/g, 'size={{ xs: $1, md: $2 }}');

    // Match xs={X} alone
    content = content.replace(/xs={(\d+)}/g, 'size={{ xs: $1 }}');

    fs.writeFileSync(file, content);
    console.log('Fixed', file);
});
