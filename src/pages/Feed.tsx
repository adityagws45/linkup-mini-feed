import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { type Profile } from "@/lib/supabase";

interface FeedProps {
  currentUser: Profile;
}

export const Feed = ({ currentUser }: FeedProps) => {
  const { user } = useAuth();
  const { posts, loading, createPost, likePost } = usePosts();

  const handleCreatePost = async (content: string) => {
    if (!user) return;
    await createPost(content, user.id);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    await likePost(postId, user.id);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <CreatePost currentUser={currentUser} onCreatePost={handleCreatePost} />
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};