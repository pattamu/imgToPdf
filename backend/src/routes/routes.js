const express = require('express');
const router = express.Router();

const { createPdf, generatePdf, downloadPdf, clearPdf} = require('../controller/pdfGenerator')


router.post('/createpdf', createPdf);

router.post('/generate-pdf', generatePdf);

router.get('/download-pdf/:filename', downloadPdf);

router.delete('/clear-pdf', clearPdf);

module.exports = router;