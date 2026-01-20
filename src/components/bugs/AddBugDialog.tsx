import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, Video, X } from "lucide-react";
import { Collaborator, MediaAttachment } from "@/types";

interface AddBugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBug: (bug: {
    title: string;
    description: string;
    assignedTo?: Collaborator;
    media?: MediaAttachment[];
  }) => void;
  collaborators: Collaborator[];
}

const AddBugDialog = ({
  open,
  onOpenChange,
  onAddBug,
  collaborators,
}: AddBugDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [media, setMedia] = useState<MediaAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (isImage || isVideo) {
        const url = URL.createObjectURL(file);
        const newMedia: MediaAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: isImage ? "image" : "video",
          url,
          name: file.name,
        };
        setMedia((prev) => [...prev, newMedia]);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = () => {
    if (title.trim()) {
      const assignedTo = collaborators.find((c) => c.id === assignedToId);
      onAddBug({ title, description, assignedTo, media: media.length > 0 ? media : undefined });
      setTitle("");
      setDescription("");
      setAssignedToId("");
      setMedia([]);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setAssignedToId("");
    setMedia([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Report New Bug</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Bug Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for the bug"
              className="bg-muted border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the bug in detail..."
              className="bg-muted border-border resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To (Optional)</Label>
            <Select value={assignedToId} onValueChange={setAssignedToId}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select collaborator" />
              </SelectTrigger>
              <SelectContent>
                {collaborators.map((collaborator) => (
                  <SelectItem key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-border"
              >
                <ImagePlus className="h-4 w-4 mr-1" />
                Add Image
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-border"
              >
                <Video className="h-4 w-4 mr-1" />
                Add Video
              </Button>
            </div>

            {/* Media Preview */}
            {media.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {media.map((item) => (
                  <div key={item.id} className="relative group">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-20 object-cover rounded-md border border-border"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-20 object-cover rounded-md border border-border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(item.id)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 truncate rounded-b-md">
                      {item.type === "video" ? "🎥" : "🖼️"} {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Report Bug
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBugDialog;