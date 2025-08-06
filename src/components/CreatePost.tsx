import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Calendar, FileText, Smile } from "lucide-react";
import { type Profile } from "@/lib/supabase";
import { toast } from "sonner";

interface CreatePostProps {
  currentUser: Profile;
  onCreatePost: (content: string) => Promise<void>;
}

export const CreatePost = ({ currentUser, onCreatePost }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async () => {
    if (content.trim()) {
      await onCreatePost(content);
      setContent("");
      setIsExpanded(false);
    }
  };

  const handlePhotoClick = () => {
    toast.info("Photo upload feature coming soon!");
  };

  const handleDocumentClick = () => {
    toast.info("Document upload feature coming soon!");
  };

  const handleEventClick = () => {
    toast.info("Event creation feature coming soon!");
  };

  const handleFeelingClick = () => {
    const feelings = ["😊 Happy", "😢 Sad", "😍 Excited", "😴 Tired", "🤔 Thoughtful", "💪 Motivated"];
    const randomFeeling = feelings[Math.floor(Math.random() * feelings.length)];
    setContent(prev => prev + ` feeling ${randomFeeling}`);
    toast.success(`Added feeling: ${randomFeeling}`);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={currentUser?.avatar_url} />
            <AvatarFallback className="bg-linkedin text-white">
              {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-[60px] border-none resize-none p-0 text-lg placeholder:text-muted-foreground focus:ring-0"
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-3">
                {/* Media options */}
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handlePhotoClick}>
                    <Image className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleDocumentClick}>
                    <FileText className="w-5 h-5 mr-2" />
                    Document
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleEventClick}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Event
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleFeelingClick}>
                    <Smile className="w-5 h-5 mr-2" />
                    Feeling
                  </Button>
                </div>
                
                {/* Post button */}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsExpanded(false);
                      setContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="bg-linkedin hover:bg-linkedin-dark"
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};