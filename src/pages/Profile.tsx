import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/PostCard";
import { Edit2, MapPin, Calendar, Link as LinkIcon, Mail } from "lucide-react";

interface ProfileProps {
  currentUser: any;
}

export const Profile = ({ currentUser }: ProfileProps) => {
  // Mock user posts - in a real app, these would be fetched from your backend
  const [userPosts] = useState([
    {
      id: 101,
      author: currentUser,
      content: "Excited to share that I've just completed my latest project! It's been an incredible journey of learning and growth. Looking forward to what's next! 🚀",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 5,
      comments: 2,
      isLiked: false
    },
    {
      id: 102,
      author: currentUser,
      content: "Reflecting on my career journey so far. Every challenge has been a stepping stone to growth. Grateful for all the amazing people I've met along the way.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 8,
      comments: 1,
      isLiked: true
    }
  ]);

  const handleLike = (postId: number) => {
    // Handle like functionality
    console.log("Liked post:", postId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="shadow-sm">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-linkedin to-linkedin-light rounded-t-lg"></div>
          
          {/* Profile Picture */}
          <Avatar className="absolute -bottom-16 left-8 w-32 h-32 border-4 border-white">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-linkedin text-white text-2xl">
              {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <CardContent className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{currentUser?.name}</h1>
              <p className="text-lg text-muted-foreground">{currentUser?.bio}</p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser?.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* About Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {currentUser?.bio || "Professional passionate about technology and innovation."}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-linkedin">portfolio.example.com</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Posts</span>
                  <span className="font-semibold">{userPosts.length}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Connections</span>
                  <span className="font-semibold">500+</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Profile views</span>
                  <span className="font-semibold">127</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={handleLike}
                    currentUser={currentUser}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No posts yet. Share your first post to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};