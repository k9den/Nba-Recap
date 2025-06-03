export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="bg-gray-900 border border-gray-700 text-white p-2 rounded w-full"
      {...props}
    />
  );
}
