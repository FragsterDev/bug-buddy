import { useState } from "react";
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
import { Collaborator } from "@/types";

interface AddBugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBug: (bug: {
    title: string;
    description: string;
    assignedTo?: Collaborator;
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

  const handleSubmit = () => {
    if (title.trim()) {
      const assignedTo = collaborators.find((c) => c.id === assignedToId);
      onAddBug({ title, description, assignedTo });
      setTitle("");
      setDescription("");
      setAssignedToId("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
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
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
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
