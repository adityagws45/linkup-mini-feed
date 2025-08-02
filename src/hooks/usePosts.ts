import { useState, useEffect } from 'react';
import { supabase, type Post } from '@/lib/supabase';
import { toast } from 'sonner';

export const usePosts = (userId?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (
            id,
            name,
            email,
            bio,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, currentUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: currentUserId,
            content,
          },
        ])
        .select(`
          *,
          profiles (
            id,
            name,
            email,
            bio,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      toast.success('Post created successfully!');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const likePost = async (postId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([
            {
              post_id: postId,
              user_id: userId,
            },
          ]);

        if (error) throw error;
      }

      // Refresh posts to get updated like counts
      await fetchPosts();
    } catch (error: any) {
      toast.error('Failed to update like');
    }
  };

  const getPostLikes = async (postId: string) => {
    try {
      const { count, error } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      return 0;
    }
  };

  const isPostLiked = async (postId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      return false;
    }
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    getPostLikes,
    isPostLiked,
    refetch: fetchPosts,
  };
};