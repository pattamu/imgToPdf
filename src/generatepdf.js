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

module.exports = {base64ImagesToPDF};