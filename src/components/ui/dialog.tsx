import { ReactNode } from 'react';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-4 text-white text-lg"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold">{children}</h2>;
}
