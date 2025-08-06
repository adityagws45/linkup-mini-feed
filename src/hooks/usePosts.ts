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
      let postsQuery = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        postsQuery = postsQuery.eq('user_id', userId);
      }

      const { data: postsData, error: postsError } = await postsQuery;
      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(postsData.map(post => post.user_id))];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine posts with profiles
      const postsWithProfiles = postsData.map(post => ({
        ...post,
        profiles: profilesData?.find(profile => profile.id === post.user_id) || null
      }));

      setPosts(postsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, currentUserId: string) => {
    try {
      const { data: newPost, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: currentUserId,
            content,
          },
        ])
        .select('*')
        .single();

      if (error) throw error;

      // Fetch the user's profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (profileError) throw profileError;

      // Combine post with profile
      const postWithProfile = {
        ...newPost,
        profiles: userProfile
      };

      setPosts(prev => [postWithProfile, ...prev]);
      toast.success('Post created successfully!');
      return { data: postWithProfile, error: null };
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