import { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";

const DocumentModal = ({ title, file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-card w-[95%] max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* PDF Content */}
        <div
          ref={containerRef}
          className="overflow-auto p-4"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth ? containerWidth - 16 : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-6 flex justify-center"
              />
            ))}
          </Document>
        </div>

        <div className="text-xs text-muted-foreground p-3 border-t border-border">
          Viewing only. Downloading and copying are restricted.
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
