import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/projects/ProjectCard";
import AddProjectDialog from "@/components/projects/AddProjectDialog";
import { Project } from "@/types";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddProject = (projectData: {
    name: string;
    description: string;
    githubUrl: string;
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            No projects yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to start tracking bugs
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <AddProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default Index;
