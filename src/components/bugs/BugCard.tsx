import { useState } from "react";
import { CheckCircle, Circle, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug } from "@/types";
import RemarksDialog from "./RemarksDialog";
import ViewRemarksDialog from "./ViewRemarksDialog";

interface BugCardProps {
  bug: Bug;
  onResolve: (bugId: string, remarks: string) => void;
}

const BugCard = ({ bug, onResolve }: BugCardProps) => {
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [viewRemarksOpen, setViewRemarksOpen] = useState(false);

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

                <p className="text-xs text-muted-foreground mt-2">
                  Created: {formatDate(bug.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              {bug.status === "open" && (
                <Button
                  size="sm"
                  onClick={() => setRemarksOpen(true)}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Resolved
                </Button>
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
    </>
  );
};

export default BugCard;
