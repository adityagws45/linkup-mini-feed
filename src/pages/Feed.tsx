import { useState, useEffect } from "react";
import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";

interface FeedProps {
  currentUser: any;
}

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Sarah Johnson",
      bio: "Senior Software Engineer at TechCorp"
    },
    content: "Just completed a successful deployment of our new microservices architecture! Excited to see how it improves our system performance. #DevOps #TechLife",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    comments: 3,
    isLiked: false
  },
  {
    id: 2,
    author: {
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Michael Chen",
      bio: "Product Manager | Building the future of work"
    },
    content: "Attending an amazing conference on AI and machine learning today. The innovations in this space are mind-blowing! Looking forward to implementing some of these concepts in our product roadmap.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8,
    comments: 2,
    isLiked: true
  },
  {
    id: 3,
    author: {
      name: "Emily Rodriguez",
      email: "emily@example.com",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Emily Rodriguez",
      bio: "UX Designer passionate about creating inclusive experiences"
    },
    content: "Just wrapped up user interviews for our new feature. The insights we gathered will completely reshape our design approach. User-centered design is not just a methodology, it's a mindset! 🎨",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 15,
    comments: 5,
    isLiked: false
  }
];

export const Feed = ({ currentUser }: FeedProps) => {
  const [posts, setPosts] = useState(mockPosts);

  const handleCreatePost = (content: string) => {
    const newPost = {
      id: Date.now(),
      author: {
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        bio: currentUser.bio
      },
      content,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLike = (postId: number) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <CreatePost currentUser={currentUser} onCreatePost={handleCreatePost} />
      
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={handleLike}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};