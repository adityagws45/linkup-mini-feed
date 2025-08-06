import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Briefcase, 
  CheckCircle,
  X,
  MoreHorizontal
} from "lucide-react";
import { type Profile } from "@/lib/supabase";

interface Notification {
  id: string;
  type: "like" | "comment" | "connection" | "job" | "mention";
  actor: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    actor: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Sarah Johnson"
    },
    message: "liked your post about web development trends",
    timestamp: "2 minutes ago",
    read: false
  },
  {
    id: "2",
    type: "connection",
    actor: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Michael Chen"
    },
    message: "wants to connect with you",
    timestamp: "1 hour ago",
    read: false
  },
  {
    id: "3",
    type: "comment",
    actor: {
      name: "Emily Davis",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Emily Davis"
    },
    message: "commented on your post: 'Great insights! Thanks for sharing.'",
    timestamp: "3 hours ago",
    read: true
  },
  {
    id: "4",
    type: "job",
    actor: {
      name: "TechCorp Inc.",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=TechCorp"
    },
    message: "posted a new job that matches your interests: Senior Frontend Developer",
    timestamp: "1 day ago",
    read: true
  },
  {
    id: "5",
    type: "mention",
    actor: {
      name: "Alex Rodriguez",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Alex Rodriguez"
    },
    message: "mentioned you in a post about React best practices",
    timestamp: "2 days ago",
    read: false
  }
];

interface NotificationsProps {
  currentUser: Profile;
}

export const Notifications = ({ currentUser }: NotificationsProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-red-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "connection": return <UserPlus className="w-4 h-4 text-green-500" />;
      case "job": return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "mention": return <Bell className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "connections") return notif.type === "connection";
    if (activeTab === "jobs") return notif.type === "job";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-linkedin" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Stay up to date with your network
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500">
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeTab === "unread" 
                    ? "All caught up! You have no unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "bg-blue-50/50 border-l-4 border-l-linkedin" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={notification.actor.avatar} />
                        <AvatarFallback>
                          {notification.actor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{notification.actor.name}</span>{" "}
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-linkedin rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                          {notification.type === "connection" && (
                            <>
                              <Button size="sm" className="bg-linkedin hover:bg-linkedin-dark">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Ignore
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};