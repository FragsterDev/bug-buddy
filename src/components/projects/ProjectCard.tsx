import { useNavigate } from "react-router-dom";
import { FolderOpen, Github, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="bg-card border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description || "No description"}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              {project.githubUrl && (
                <div className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  <span>GitHub</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
