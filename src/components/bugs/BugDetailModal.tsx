import { useState } from "react";
import { CheckCircle, Circle, User, UserCheck, Calendar, MessageSquare, Image, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bug } from "@/types";
import RemarksDialog from "./RemarksDialog";
import ViewRemarksDialog from "./ViewRemarksDialog";
import MediaViewer from "./MediaViewer";

interface BugDetailModalProps {
  bug: Bug | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (bugId: string, remarks: string) => void;
  canResolve: boolean;
}

const BugDetailModal = ({ bug, open, onOpenChange, onResolve, canResolve }: BugDetailModalProps) => {
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [viewRemarksOpen, setViewRemarksOpen] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (!bug) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openMediaViewer = (index: number) => {
    setSelectedMediaIndex(index);
    setMediaViewerOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {bug.status === "resolved" ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <Circle className="h-6 w-6 text-warning" />
              )}
              <DialogTitle className="text-xl">{bug.title}</DialogTitle>
              <Badge
                variant={bug.status === "resolved" ? "default" : "secondary"}
                className={
                  bug.status === "resolved"
                    ? "bg-success/20 text-success border-success/30"
                    : "bg-warning/20 text-warning border-warning/30"
                }
              >
                {bug.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-foreground">{bug.description}</p>
            </div>

            {/* Media Attachments */}
            {bug.media && bug.media.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Attachments ({bug.media.length})
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {bug.media.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative cursor-pointer group"
                      onClick={() => openMediaViewer(index)}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-20 object-cover rounded-md border border-border group-hover:border-primary transition-colors"
                        />
                      ) : (
                        <div className="relative">
                          <video
                            src={item.url}
                            className="w-full h-20 object-cover rounded-md border border-border group-hover:border-primary transition-colors"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* People */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground">Reported by</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {getInitials(bug.reportedBy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{bug.reportedBy.name}</p>
                    <p className="text-xs text-muted-foreground">{bug.reportedBy.email}</p>
                  </div>
                </div>
              </div>

              {bug.assignedTo && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">Assigned to</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent/50 text-accent-foreground text-sm">
                        {getInitials(bug.assignedTo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{bug.assignedTo.name}</p>
                      <p className="text-xs text-muted-foreground">{bug.assignedTo.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                </div>
                <p className="text-sm text-foreground">{formatDate(bug.createdAt)}</p>
              </div>

              {bug.resolvedAt && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">Resolved</h4>
                  </div>
                  <p className="text-sm text-foreground">{formatDate(bug.resolvedAt)}</p>
                </div>
              )}
            </div>

            {/* Remarks */}
            {bug.status === "resolved" && bug.remarks && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground">Resolution Remarks</h4>
                </div>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md">{bug.remarks}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              {bug.status === "open" && canResolve && (
                <Button
                  onClick={() => setRemarksOpen(true)}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}

              {bug.status === "open" && !canResolve && (
                <p className="text-sm text-muted-foreground italic">
                  Only the assignee or project owner can resolve this bug
                </p>
              )}

              {bug.status === "resolved" && bug.remarks && (
                <Button
                  variant="outline"
                  onClick={() => setViewRemarksOpen(true)}
                  className="border-border"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Full Remarks
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RemarksDialog
        open={remarksOpen}
        onOpenChange={setRemarksOpen}
        onSubmit={(remarks) => {
          onResolve(bug.id, remarks);
          setRemarksOpen(false);
          onOpenChange(false);
        }}
      />

      <ViewRemarksDialog
        open={viewRemarksOpen}
        onOpenChange={setViewRemarksOpen}
        remarks={bug.remarks || ""}
        resolvedAt={bug.resolvedAt}
      />

      {bug.media && bug.media.length > 0 && (
        <MediaViewer
          open={mediaViewerOpen}
          onOpenChange={setMediaViewerOpen}
          media={bug.media}
          initialIndex={selectedMediaIndex}
        />
      )}
    </>
  );
};

export default BugDetailModal;
