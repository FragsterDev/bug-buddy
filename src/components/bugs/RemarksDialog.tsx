import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RemarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (remarks: string) => void;
}

const RemarksDialog = ({ open, onOpenChange, onSubmit }: RemarksDialogProps) => {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    onSubmit(remarks);
    setRemarks("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Remarks</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="remarks">Resolution Remarks</Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Describe how the bug was resolved..."
            className="bg-muted border-border resize-none mt-2"
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemarksDialog;
