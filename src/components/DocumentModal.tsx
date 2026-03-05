import { Minus, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page } from "react-pdf";

const DocumentModal = ({ title, file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1); // 1 = 100%
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);
  const { t } = useTranslation();

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

          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1 shadow-md">
              <button
                onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 shadow-sm transition"
              >
                <Minus className="jadwa-icon-gold" size={16} />
              </button>

              <span className="w-12 text-center text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 shadow-sm transition"
              >
                <Plus className="jadwa-icon-gold" size={16} />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-jadwa-muted hover:text-foreground text-xl font-bold transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto p-4 bg-gray-50 rounded-b-2xl relative"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={
                  containerWidth ? (containerWidth - 16) * zoom : undefined
                }
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-6 flex justify-center rounded-lg shadow-sm bg-white"
              />
            ))}
          </Document>
        </div>

        {/* Footer */}
        <div className="text-xs text-jadwa-muted p-3 border-t border-border text-center">
          {t("fund.view_only_no_download")}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
