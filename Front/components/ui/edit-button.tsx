import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export function EditButton({ onClick, className = '' }: EditButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`absolute -top-2 -right-2 w-6 h-6 p-0 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 rounded-full transition-all duration-200 hover:scale-110 ${className}`}
    >
      <Pencil className="w-3 h-3 text-gray-300" />
    </Button>
  );
}