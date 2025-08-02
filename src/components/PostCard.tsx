import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Post, type Profile } from "@/lib/supabase";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  currentUser: Profile;
}

export const PostCard = ({ post, onLike, currentUser }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { getPostLikes, isPostLiked } = usePosts();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikeData = async () => {
      if (user) {
        const [likeCount, userLiked] = await Promise.all([
          getPostLikes(post.id),
          isPostLiked(post.id, user.id)
        ]);
        setLikes(likeCount);
        setIsLiked(userLiked);
      }
    };
    
    fetchLikeData();
  }, [post.id, user]);

  const handleLike = async () => {
    await onLike(post.id);
    // Refresh like data after the action
    if (user) {
      const [likeCount, userLiked] = await Promise.all([
        getPostLikes(post.id),
        isPostLiked(post.id, user.id)
      ]);
      setLikes(likeCount);
      setIsLiked(userLiked);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.profiles.avatar_url} />
              <AvatarFallback className="bg-linkedin text-white">
                {post.profiles.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{post.profiles.name}</h3>
              <p className="text-sm text-muted-foreground">{post.profiles.bio}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-foreground leading-relaxed mb-4">{post.content}</p>
        
        {/* Post stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2 mb-2">
          <span>{likes} likes</span>
          <span>0 comments</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center space-x-2 flex-1 ${
              isLiked ? 'text-red-500' : 'text-muted-foreground'
            }`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 flex-1 text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 flex-1 text-muted-foreground"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 flex-1 text-muted-foreground"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};