export const Field = ({ label, required, children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
      <div className="md:col-span-4">
        <p className="text-sm text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </p>
      </div>
      <div className="md:col-span-8">{children}</div>
    </div>
  );
};
