import { useState } from "react";
import DocumentModal from "./DocumentModal";

const DocumentCard = ({ title, file }) => {
  const [open, setOpen] = useState(false);

  if (!file) return null;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group relative cursor-pointer rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

        <div className="relative flex flex-col gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            PDF
          </div>

          {/* Title */}
          <div>
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Click to preview document
            </p>
          </div>
        </div>
      </div>

      {open && (
        <DocumentModal
          title={title}
          file={file}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default DocumentCard;
