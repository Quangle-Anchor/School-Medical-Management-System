export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border rounded text-sm shadow-sm ${className}`}
      {...props}
    />
  );
};
