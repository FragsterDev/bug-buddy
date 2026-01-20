import { useState } from "react";
import { CheckCircle, Circle, MessageSquare, User, UserCheck, Image, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bug } from "@/types";
import RemarksDialog from "./RemarksDialog";
import ViewRemarksDialog from "./ViewRemarksDialog";
import MediaViewer from "./MediaViewer";

interface BugCardProps {
  bug: Bug;
  onResolve: (bugId: string, remarks: string) => void;
  canResolve: boolean;
}

const BugCard = ({ bug, onResolve, canResolve }: BugCardProps) => {
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [viewRemarksOpen, setViewRemarksOpen] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

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
      <div className="relative pl-12 pb-8 last:pb-0">
        {/* Timeline dot */}
        <div className="absolute left-0 top-0">
          {bug.status === "resolved" ? (
            <CheckCircle className="h-6 w-6 text-success" />
          ) : (
            <Circle className="h-6 w-6 text-warning" />
          )}
        </div>

        {/* Timeline line */}
        <div className="timeline-line" />

        <Card className="bg-card border-border animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">{bug.title}</h3>
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

                <p className="text-sm text-muted-foreground">{bug.description}</p>

                {/* Media Attachments */}
                {bug.media && bug.media.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Image className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {bug.media.length} attachment{bug.media.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {bug.media.slice(0, 4).map((item, index) => (
                        <div
                          key={item.id}
                          className="relative cursor-pointer group"
                          onClick={() => openMediaViewer(index)}
                        >
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-16 object-cover rounded-md border border-border group-hover:border-primary transition-colors"
                            />
                          ) : (
                            <div className="relative">
                              <video
                                src={item.url}
                                className="w-full h-16 object-cover rounded-md border border-border group-hover:border-primary transition-colors"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                                <Play className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          )}
                          {index === 3 && bug.media && bug.media.length > 4 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-md">
                              <span className="text-white font-medium">+{bug.media.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reporter and Assignee info */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Reported by:</span>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                          {getInitials(bug.reportedBy.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-foreground">{bug.reportedBy.name}</span>
                    </div>
                  </div>

                  {bug.assignedTo && (
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Assigned to:</span>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-accent/50 text-accent-foreground text-[10px]">
                            {getInitials(bug.assignedTo.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground">{bug.assignedTo.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Created: {formatDate(bug.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              {bug.status === "open" && canResolve && (
                <Button
                  size="sm"
                  onClick={() => setRemarksOpen(true)}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Resolved
                </Button>
              )}

              {bug.status === "open" && !canResolve && (
                <p className="text-xs text-muted-foreground italic">
                  Only the assignee or project owner can resolve this bug
                </p>
              )}

              {bug.status === "resolved" && bug.remarks && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewRemarksOpen(true)}
                  className="border-border"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  View Remarks
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <RemarksDialog
        open={remarksOpen}
        onOpenChange={setRemarksOpen}
        onSubmit={(remarks) => {
          onResolve(bug.id, remarks);
          setRemarksOpen(false);
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

export default BugCard;