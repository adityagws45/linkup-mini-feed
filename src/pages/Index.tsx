import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Navbar } from "@/components/Navbar";
import { Feed } from "@/pages/Feed";
import { Profile } from "@/pages/Profile";
import { Network } from "@/pages/Network";
import { Jobs } from "@/pages/Jobs";
import { Messaging } from "@/pages/Messaging";
import { Notifications } from "@/pages/Notifications";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("feed");
  const { user, profile, loading, signOut } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-linkedin mb-4">LinkUp</div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <Profile currentUser={profile} />;
      case "network":
        return <Network currentUser={profile} />;
      case "jobs":
        return <Jobs />;
      case "messages":
        return <Messaging currentUser={profile} />;
      case "notifications":
        return <Notifications currentUser={profile} />;
      case "feed":
      default:
        return <Feed currentUser={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        currentUser={profile} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>

      {/* Logout button for demo */}
      <Button
        onClick={signOut}
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
