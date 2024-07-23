const express = require('express');
const router = express.Router();

const { createPdf, generatePdf, downloadPdf} = require('../controller/pdfGenerator')


router.post('/createpdf', createPdf);

router.post('/generate-pdf', generatePdf);

router.get('/download-pdf/:filename', downloadPdf);

module.exports = router;