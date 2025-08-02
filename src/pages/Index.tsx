import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Navbar } from "@/components/Navbar";
import { Feed } from "@/pages/Feed";
import { Profile } from "@/pages/Profile";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("feed");

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentPage("feed");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setCurrentPage("feed");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <Profile currentUser={currentUser} />;
      case "feed":
      default:
        return <Feed currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        currentUser={currentUser} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>

      {/* Logout button for demo */}
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default Index;
