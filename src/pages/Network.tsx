import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, MessageCircle } from "lucide-react";
import { supabase, type Profile } from "@/lib/supabase";
import { toast } from "sonner";

interface NetworkProps {
  currentUser: Profile;
}

export const Network = ({ currentUser }: NetworkProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [currentUser.id]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser.id)
        .limit(10);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load network');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (profile: Profile) => {
    toast.success(`Sent connection request to ${profile.name}`);
  };

  const handleMessage = (profile: Profile) => {
    toast.info(`Opening message to ${profile.name}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center text-muted-foreground">Loading network...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-linkedin" />
        <div>
          <h1 className="text-3xl font-bold">My Network</h1>
          <p className="text-muted-foreground">Manage your professional network</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-linkedin text-white text-lg">
                  {profile.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.bio && (
                <p className="text-sm text-center">{profile.bio}</p>
              )}
              <div className="flex justify-center">
                <Badge variant="secondary">Professional</Badge>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-linkedin hover:bg-linkedin-dark"
                  onClick={() => handleConnect(profile)}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Connect
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleMessage(profile)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
          <p className="text-muted-foreground">Start building your professional network!</p>
        </div>
      )}
    </div>
  );
};