import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Home, MessageSquare, Users, Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  currentUser: any;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar = ({ currentUser, onNavigate, currentPage }: NavbarProps) => {
  const navItems = [
    { icon: Home, label: "Home", page: "feed" },
    { icon: Users, label: "Network", page: "network" },
    { icon: Briefcase, label: "Jobs", page: "jobs" },
    { icon: MessageSquare, label: "Messaging", page: "messages" },
    { icon: Bell, label: "Notifications", page: "notifications" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="text-2xl font-bold text-linkedin cursor-pointer"
              onClick={() => onNavigate("feed")}
            >
              LinkUp
            </div>
            
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search..." 
                className="pl-10 w-64 bg-muted/50"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.page}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center px-3 py-2 h-auto ${
                  currentPage === item.page ? "text-linkedin" : "text-muted-foreground"
                }`}
                onClick={() => onNavigate(item.page)}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => onNavigate("profile")}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback className="bg-linkedin text-white text-xs">
                  {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm">Me</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};