import { Bug } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  user: {
    name: string;
    avatar: string;
  };
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bug className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-foreground">BugTracker</span>
      </div>

      <Link to="/profile">
        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
};

export default Header;
