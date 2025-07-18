import React from 'react';

const TestPDF = () => {
  const pdfPath = '/test.pdf'; // Path relative to the public directory

  return (

        <div className="flex h-screen">
          <iframe
            src={pdfPath}
            title="My PDF Document"
            className="w-1/2 h-full border-none"
            style={{ minHeight: '100%' }} >
            This browser does not support PDFs. Please download the PDF to view it:
            <a href={pdfPath} download>Download PDF</a>
          </iframe>
          <div className="w-1/2 h-full bg-gray-100 p-4">Hello</div>
        </div>
  );
};

export default TestPDF;