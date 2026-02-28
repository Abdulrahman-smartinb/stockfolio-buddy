const InputField = ({ label, required, className = "", ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] md:text-sm font-medium text-gray-600 tracking-tight">
      {required && <span className="text-red-400 mr-1">*</span>}
      {label}
    </label>

    <input
      {...props}
      className={`
        w-full
        h-9 md:h-11
        rounded-lg
        border border-gray-200
        bg-white
        px-3.5
        text-[13px] md:text-sm
        text-gray-900
        placeholder:text-gray-400
        focus:outline-none
        focus:border-gray-400
        focus:ring-2
        focus:ring-gray-100
        transition-all duration-200
        ${className}
      `}
    />
  </div>
);

export default InputField;
