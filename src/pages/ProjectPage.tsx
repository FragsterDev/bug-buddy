import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Bug as BugIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BugCard from "@/components/bugs/BugCard";
import AddBugDialog from "@/components/bugs/AddBugDialog";
import { Bug } from "@/types";

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addBugOpen, setAddBugOpen] = useState(false);

  // Mock bugs data - in a real app this would come from a database
  const [bugs, setBugs] = useState<Bug[]>([
    {
      id: "1",
      projectId: id || "",
      title: "Login button not responding",
      description:
        "Users report that the login button sometimes doesn't respond on the first click. This happens mainly on mobile devices.",
      status: "open",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2",
      projectId: id || "",
      title: "Dark mode toggle broken",
      description:
        "The dark mode toggle in settings doesn't persist after page refresh.",
      status: "resolved",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      resolvedAt: new Date(Date.now() - 86400000).toISOString(),
      remarks: "Fixed by updating the local storage logic to properly save user preferences.",
    },
  ]);

  const handleAddBug = (bugData: { title: string; description: string }) => {
    const newBug: Bug = {
      id: Date.now().toString(),
      projectId: id || "",
      ...bugData,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setBugs([newBug, ...bugs]);
  };

  const handleResolveBug = (bugId: string, remarks: string) => {
    setBugs(
      bugs.map((bug) =>
        bug.id === bugId
          ? {
              ...bug,
              status: "resolved" as const,
              resolvedAt: new Date().toISOString(),
              remarks,
            }
          : bug
      )
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          Project #{id}
        </h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-foreground">Bug History</h2>
        <Button onClick={() => setAddBugOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Report Bug
        </Button>
      </div>

      {bugs.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <BugIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            No bugs reported
          </h2>
          <p className="text-muted-foreground mb-4">
            Great! This project has no reported bugs yet.
          </p>
          <Button onClick={() => setAddBugOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Bug
          </Button>
        </div>
      ) : (
        <div className="relative">
          {bugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} onResolve={handleResolveBug} />
          ))}
        </div>
      )}

      <AddBugDialog
        open={addBugOpen}
        onOpenChange={setAddBugOpen}
        onAddBug={handleAddBug}
      />
    </div>
  );
};

export default ProjectPage;
