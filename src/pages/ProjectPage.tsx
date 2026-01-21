import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Bug as BugIcon, Users, CheckCircle, Circle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddBugDialog from "@/components/bugs/AddBugDialog";
import CollaboratorsDialog from "@/components/projects/CollaboratorsDialog";
import BugDetailModal from "@/components/bugs/BugDetailModal";
import { Bug, Collaborator, MediaAttachment } from "@/types";

// Mock current user - in a real app this would come from auth
const currentUser: Collaborator = {
  id: "current-user",
  name: "John Doe",
  email: "john@example.com",
};

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addBugOpen, setAddBugOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [bugDetailOpen, setBugDetailOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock project owner - in a real app this would come from the project data
  const ownerId = "current-user";

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: "collab-1", name: "Jane Smith", email: "jane@example.com" },
    { id: "collab-2", name: "Bob Wilson", email: "bob@example.com" },
  ]);

  const [bugs, setBugs] = useState<Bug[]>([
    {
      id: "1",
      projectId: id || "",
      title: "Login button not responding",
      description:
        "Users report that the login button sometimes doesn't respond on the first click. This happens mainly on mobile devices.",
      status: "open",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      reportedBy: { id: "collab-1", name: "Jane Smith", email: "jane@example.com" },
      assignedTo: { id: "collab-2", name: "Bob Wilson", email: "bob@example.com" },
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
      remarks:
        "Fixed by updating the local storage logic to properly save user preferences.",
      reportedBy: currentUser,
      assignedTo: currentUser,
    },
  ]);

  const handleAddBug = (bugData: {
    title: string;
    description: string;
    assignedTo?: Collaborator;
    media?: MediaAttachment[];
  }) => {
    const newBug: Bug = {
      id: Date.now().toString(),
      projectId: id || "",
      title: bugData.title,
      description: bugData.description,
      status: "open",
      createdAt: new Date().toISOString(),
      reportedBy: currentUser,
      assignedTo: bugData.assignedTo,
      media: bugData.media,
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

  const handleAddCollaborator = (collaborator: Collaborator) => {
    setCollaborators([...collaborators, collaborator]);
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== collaboratorId));
  };

  // Check if current user can resolve a bug
  const canResolveBug = (bug: Bug) => {
    const isOwner = currentUser.id === ownerId;
    const isAssignee = bug.assignedTo?.id === currentUser.id;
    return isOwner || isAssignee;
  };

  // All collaborators including current user for assignment
  const allCollaborators = [currentUser, ...collaborators];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const handleRowClick = (bug: Bug) => {
    setSelectedBug(bug);
    setBugDetailOpen(true);
  };

  // Filter and search bugs
  const filteredBugs = useMemo(() => {
    return bugs
      .filter((bug) => {
        if (filter === "resolved") return bug.status === "resolved";
        if (filter === "unresolved") return bug.status === "open";
        return true;
      })
      .filter((bug) =>
        bug.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [bugs, filter, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto">
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
        <h2 className="text-lg font-medium text-foreground">Bug List</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCollaboratorsOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Collaborators ({collaborators.length})
          </Button>
          <Button onClick={() => setAddBugOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Bug
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("resolved")}
        >
          Resolved
        </Button>
        <Button
          variant={filter === "unresolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unresolved")}
        >
          Unresolved
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bugs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
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
      ) : filteredBugs.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            No bugs found
          </h2>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Sno.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Date Created</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-32">Date Resolved</TableHead>
                <TableHead className="w-24 text-center">Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBugs.map((bug, index) => (
                <TableRow
                  key={bug.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(bug)}
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{bug.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(bug.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={bug.status === "resolved" ? "default" : "secondary"}
                      className={
                        bug.status === "resolved"
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-warning/20 text-warning border-warning/30"
                      }
                    >
                      <span className="flex items-center gap-1">
                        {bug.status === "resolved" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                        {bug.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {bug.resolvedAt ? formatDate(bug.resolvedAt) : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {bug.assignedTo ? (
                      <Avatar className="h-7 w-7 mx-auto">
                        <AvatarFallback className="bg-accent/50 text-accent-foreground text-xs">
                          {getInitials(bug.assignedTo.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddBugDialog
        open={addBugOpen}
        onOpenChange={setAddBugOpen}
        onAddBug={handleAddBug}
        collaborators={allCollaborators}
      />

      <CollaboratorsDialog
        open={collaboratorsOpen}
        onOpenChange={setCollaboratorsOpen}
        collaborators={collaborators}
        onAddCollaborator={handleAddCollaborator}
        onRemoveCollaborator={handleRemoveCollaborator}
      />

      <BugDetailModal
        bug={selectedBug}
        open={bugDetailOpen}
        onOpenChange={setBugDetailOpen}
        onResolve={handleResolveBug}
        canResolve={selectedBug ? canResolveBug(selectedBug) : false}
      />
    </div>
  );
};

export default ProjectPage;
