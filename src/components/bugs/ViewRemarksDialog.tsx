import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface ViewRemarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remarks: string;
  resolvedAt?: string;
}

const ViewRemarksDialog = ({
  open,
  onOpenChange,
  remarks,
  resolvedAt,
}: ViewRemarksDialogProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Resolution Remarks
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-foreground">{remarks || "No remarks provided."}</p>

          {resolvedAt && (
            <p className="text-xs text-muted-foreground mt-4">
              Resolved on: {formatDate(resolvedAt)}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRemarksDialog;
