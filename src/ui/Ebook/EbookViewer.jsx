import { useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';

function EbookViewer({ fileUrl }) {
    useEffect(() => {
        const preventRightClick = e => e.preventDefault();
        window.addEventListener('contextmenu', preventRightClick);
        return () => window.removeEventListener('contextmenu', preventRightClick);
    }, []);

    return (
        <div className="no-print">
            <Document file={fileUrl}>
                <Page pageNumber={1} />
                {/* Loop pages as needed */}
            </Document>
        </div>
    );
}
