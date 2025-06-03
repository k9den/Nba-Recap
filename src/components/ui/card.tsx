export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-800 rounded-xl p-4 shadow">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
