import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Search, MoreHorizontal } from "lucide-react";
import { type Profile } from "@/lib/supabase";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar_url: string;
    online: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "user1",
      name: "Sarah Johnson",
      avatar_url: "https://api.dicebear.com/6.x/initials/svg?seed=Sarah Johnson",
      online: true
    },
    lastMessage: "Thanks for the quick response!",
    timestamp: "2 min ago",
    unread: 2,
    messages: [
      { id: "1", senderId: "user1", content: "Hi! I saw your post about the project", timestamp: "10:30 AM" },
      { id: "2", senderId: "me", content: "Hello! Yes, would love to discuss it", timestamp: "10:32 AM" },
      { id: "3", senderId: "user1", content: "Thanks for the quick response!", timestamp: "10:35 AM" }
    ]
  },
  {
    id: "2",
    participant: {
      id: "user2",
      name: "Michael Chen",
      avatar_url: "https://api.dicebear.com/6.x/initials/svg?seed=Michael Chen",
      online: false
    },
    lastMessage: "Let's schedule a call this week",
    timestamp: "1 hour ago",
    unread: 0,
    messages: [
      { id: "4", senderId: "user2", content: "Great meeting you at the conference", timestamp: "Yesterday" },
      { id: "5", senderId: "me", content: "Likewise! Thanks for the business card", timestamp: "Yesterday" },
      { id: "6", senderId: "user2", content: "Let's schedule a call this week", timestamp: "9:15 AM" }
    ]
  },
  {
    id: "3",
    participant: {
      id: "user3",
      name: "Emily Davis",
      avatar_url: "https://api.dicebear.com/6.x/initials/svg?seed=Emily Davis",
      online: true
    },
    lastMessage: "Sounds good to me!",
    timestamp: "3 hours ago",
    unread: 1,
    messages: [
      { id: "7", senderId: "me", content: "Would you like to collaborate on this project?", timestamp: "8:00 AM" },
      { id: "8", senderId: "user3", content: "Sounds good to me!", timestamp: "8:05 AM" }
    ]
  }
];

interface MessagingProps {
  currentUser: Profile;
}

export const Messaging = ({ currentUser }: MessagingProps) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "me",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // In a real app, you'd update the conversation in the backend
      setNewMessage("");
    }
  };

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-8 h-8 text-linkedin" />
        <div>
          <h1 className="text-3xl font-bold">Messaging</h1>
          <p className="text-muted-foreground">
            Stay connected with your network
            {totalUnread > 0 && (
              <Badge className="ml-2 bg-red-500">
                {totalUnread} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participant.avatar_url} />
                        <AvatarFallback>
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{conversation.participant.name}</p>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-linkedin text-white">{conversation.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.participant.avatar_url} />
                        <AvatarFallback>
                          {selectedConversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.participant.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.participant.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.participant.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === "me"
                            ? "bg-linkedin text-white"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === "me" ? "text-blue-100" : "text-muted-foreground"
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-linkedin hover:bg-linkedin-dark"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};