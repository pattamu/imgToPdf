import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Home = () => {
    const [base64String, setBase64String] = useState('');
    const [images, setImages] = useState([]);
    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBase64Change = (e) => {
        setBase64String(e.target.value);
    };

    const handleAddImage = () => {
        if (base64String.trim() !== '') {
            setImages([...images, base64String]);
            setBase64String(''); // Clear the input field after adding
        }
    };

    const handleDeleteImage = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.delete('http://localhost:5000/api/clear-pdf');
            if(response.status === 200){
                console.log(response.data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error :', error);
            setLoading(false); // End loading on error
        }
    };

    const handleSubmit = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:5000/api/generate-pdf', { images });
            if (response.data.path) {
                setPdfUrl(response.data.path);
                setLoading(false); // End loading
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            setLoading(false); // End loading on error
        }
    };

    const handleDownload = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`http://localhost:5000${pdfUrl}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'output.pdf');
            document.body.appendChild(link);
            link.click();
            setLoading(false); // End loading
        } catch (error) {
            console.error('Error downloading PDF:', error);
            setLoading(false); // End loading on error
        }
    };

    return (
        <div>
            <h1>Base64 Images to PDF Converter</h1>
            {loading ? (
                <div>Loading...</div> // Loading indicator
            ) : (
                <>
                    <div className="container">
                        <textarea
                            className="large-input"
                            value={base64String}
                            onChange={handleBase64Change}
                            placeholder="Enter base64 image string"
                        />
                        <button onClick={handleAddImage}>Add</button>
                        <button onClick={handleDeleteImage}>Clear</button>
                    </div>
                    <ol className="truncated-list">
                        {images.map((image, index) => (
                            <li key={index} className="truncated-list-item">{image}</li>
                        ))}
                    </ol>
                    <button onClick={handleSubmit}>Generate PDF</button>
                    {pdfUrl && <button className="button-container" onClick={handleDownload}>Download PDF</button>}
                </>
            )}
        </div>
    );
};


export default Home;
