const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Function to convert base64 images to a PDF
function base64ImagesToPDF(base64Images, outputPath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        base64Images.forEach((base64Image, index) => {
            const imageBuffer = Buffer.from(base64Image, 'base64');
            const imageFilePath = path.join(__dirname, `temp_image_${index}.png`);

            // Save the buffer to a temporary file
            fs.writeFileSync(imageFilePath, imageBuffer);

            // Add image to the PDF document
            doc.image(imageFilePath, {
                fit: [500, 700],
                align: 'center',
                valign: 'center',
            });

            // Add a new page if not the last image
            if (index < base64Images.length - 1) {
                doc.addPage();
            }

            // Clean up the temporary file
            fs.unlinkSync(imageFilePath);
        });

        doc.end();
        writeStream.on('finish', () => {
            resolve(outputPath);
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
}

const createPdf = async (req, res) => {
    const base64Images = req.body.images;

    if (!base64Images || !Array.isArray(base64Images)) {
        return res.status(400).send('Invalid input');
    }

    const pdfFolder = path.join(__dirname, 'pdfs');
    if (!fs.existsSync(pdfFolder)) {
        fs.mkdirSync(pdfFolder);
    }

    const timestamp = Date.now();
    const outputPath = path.join(pdfFolder, `output_${timestamp}.pdf`);

    try {
        await base64ImagesToPDF(base64Images, outputPath);
        res.download(outputPath, `output_${timestamp}.pdf`, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error downloading the file');
            } else {
                console.log(`PDF saved at ${outputPath}`);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating PDF');
    }
};

const generatePdf = async (req, res) => {
    const base64Images = req.body.images;

    if (!base64Images || !Array.isArray(base64Images)) {
        return res.status(400).send('Invalid input');
    }

    const pdfFolder = path.join(__dirname, '../pdfs');
    if (!fs.existsSync(pdfFolder)) {
        fs.mkdirSync(pdfFolder);
    }
    const timestamp = Date.now();
    const outputPath = path.join(pdfFolder, `output_${timestamp}.pdf`);

    try {
        await base64ImagesToPDF(base64Images, outputPath);
        res.status(200).json({ message: 'PDF generated', path: `/api/download-pdf/output_${timestamp}.pdf` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating PDF');
    }
};

const downloadPdf = async (req, res) => {
    const folder = '../pdfs';
    const filename = req.params.filename;
    const filePath = path.join(__dirname, folder, filename); // Construct the file path

    console.log("download-filePath: ", filePath)
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });
    // res.on('finish', () => {
    //     // Delete the file after sending it to the client
    //     fs.unlink(filePath, (unlinkErr) => {
    //         if (unlinkErr) {
    //             console.error('Error deleting file:', unlinkErr);
    //         } else {
    //             console.log('File deleted:', filePath);
    //         }
    //     });
    // });
};

module.exports = { createPdf, generatePdf, downloadPdf};