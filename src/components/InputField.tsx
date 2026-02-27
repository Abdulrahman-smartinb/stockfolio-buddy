const InputField = ({ label, required, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-600 font-medium">
      {required && <span className="text-red-500 mr-1">*</span>}
      {label}
    </label>
    <input
      {...props}
      className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition"
    />
  </div>
);

export default InputField;
