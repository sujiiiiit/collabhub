import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Resume: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null); // State for filename
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchAndDisplayPDF = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/application/resume/${id}`);
        const base64String = response.data.resume.data; // Base64 string for PDF
        const fileName = response.data.resume.filename; // Assuming filename is returned in the response
        
        setPdfSrc(`data:application/pdf;base64,${base64String}`);
        setFilename(fileName); // Set the filename state
      } catch (err) {
        setError('Failed to fetch resume.');
      }
    };

    fetchAndDisplayPDF();
  }, [id]);

  return (
    <div>
      {error && <p>{error}</p>}
      {pdfSrc && (
        <iframe src={pdfSrc} className='w-dvw h-dvh' title={filename || 'PDF Document'}></iframe>
      )}
    </div>
  );
};

export default Resume;
