import { useState } from "react";
import { UserPlus, X, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collaborator } from "@/types";

interface CollaboratorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborators: Collaborator[];
  onAddCollaborator: (collaborator: Collaborator) => void;
  onRemoveCollaborator: (collaboratorId: string) => void;
}

const CollaboratorsDialog = ({
  open,
  onOpenChange,
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
}: CollaboratorsDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (name.trim() && email.trim()) {
      onAddCollaborator({
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
      });
      setName("");
      setEmail("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Collaborators
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add new collaborator */}
          <div className="space-y-3 p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Add Collaborator</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="bg-background border-border"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-background border-border"
              />
            </div>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!name.trim() || !email.trim()}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Collaborators list */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Current Collaborators ({collaborators.length})
            </Label>
            {collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No collaborators added yet
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {getInitials(collaborator.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {collaborator.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveCollaborator(collaborator.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorsDialog;
