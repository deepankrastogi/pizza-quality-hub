import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ImageZoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt?: string;
}

export function ImageZoomDialog({ open, onOpenChange, imageUrl, alt = "Zoomed image" }: ImageZoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
