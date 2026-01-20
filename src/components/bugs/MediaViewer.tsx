import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MediaAttachment } from "@/types";

interface MediaViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaAttachment[];
  initialIndex: number;
}

const MediaViewer = ({ open, onOpenChange, media, initialIndex }: MediaViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = media[currentIndex];

  if (!currentMedia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Media display */}
          <div className="flex items-center justify-center min-h-[400px] bg-black">
            {currentMedia.type === "image" ? (
              <img
                src={currentMedia.url}
                alt={currentMedia.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                className="max-w-full max-h-[70vh]"
                autoPlay
              />
            )}
          </div>

          {/* Navigation arrows */}
          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Footer with file info */}
          <div className="p-3 bg-muted border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground truncate">{currentMedia.name}</span>
              <span className="text-xs text-muted-foreground">
                {currentIndex + 1} / {media.length}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewer;