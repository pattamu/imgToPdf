const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./routes/routes.js')

const app = express();

const { base64ImagesToPDF } = require('./generatepdf');

app.use(bodyParser.json({ limit: '50mb' })); // to handle large base64 inputs
app.use(cors()); // Enable CORS for all routes

app.use('/api', route);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
