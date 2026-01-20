// Type definitions for the bug tracker application

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  createdAt: string;
  ownerId: string;
  collaborators: Collaborator[];
}

export interface Bug {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "open" | "resolved";
  createdAt: string;
  resolvedAt?: string;
  remarks?: string;
  reportedBy: Collaborator;
  assignedTo?: Collaborator;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
