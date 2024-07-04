const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
//const PUBLIC = '/finances'
const PUBLIC = '/'
// Serve static files from the build directory
app.use(PUBLIC, express.static(path.join(__dirname, 'dist')));

// Handle all other requests by serving the index.html file
app.get(PUBLIC, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
