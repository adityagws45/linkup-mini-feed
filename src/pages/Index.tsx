import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Navbar } from "@/components/Navbar";
import { Feed } from "@/pages/Feed";
import { Profile } from "@/pages/Profile";
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
        return (
          <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">My Network</h1>
            <p className="text-muted-foreground">Network features coming soon!</p>
          </div>
        );
      case "jobs":
        return (
          <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Jobs</h1>
            <p className="text-muted-foreground">Job search features coming soon!</p>
          </div>
        );
      case "messages":
        return (
          <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Messaging</h1>
            <p className="text-muted-foreground">Messaging features coming soon!</p>
          </div>
        );
      case "notifications":
        return (
          <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <p className="text-muted-foreground">Notifications coming soon!</p>
          </div>
        );
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
