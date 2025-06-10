
import { useState } from "react";
import { Moon, Sun, User, Bell, Shield, HelpCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const settingsGroups = [
    {
      title: "Appearance",
      items: [
        {
          icon: theme === 'dark' ? Sun : Moon,
          title: "Dark Mode",
          description: "Toggle between light and dark theme",
          action: (
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
            />
          )
        }
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          title: "Push Notifications",
          description: "Receive notifications about your bookings",
          action: (
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          )
        },
        {
          icon: Bell,
          title: "Email Updates",
          description: "Get email updates about new services",
          action: (
            <Switch 
              checked={emailUpdates} 
              onCheckedChange={setEmailUpdates}
            />
          )
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          icon: User,
          title: "Profile Settings",
          description: "Manage your profile information",
          action: <ChevronRight className="w-5 h-5 text-gray-400" />,
          onClick: () => navigate('/profile')
        },
        {
          icon: Shield,
          title: "Privacy & Security",
          description: "Control your privacy settings",
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          title: "Help & Support",
          description: "Get help or contact support",
          action: <ChevronRight className="w-5 h-5 text-gray-400" />,
          onClick: () => navigate('/help-community')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                Customize your Simplifixr experience
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {settingsGroups.map((group, groupIndex) => (
            <Card key={groupIndex}>
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div 
                        className={`flex items-center justify-between py-3 ${
                          item.onClick ? 'cursor-pointer hover:bg-muted/50 rounded-lg px-3 -mx-3' : ''
                        }`}
                        onClick={item.onClick}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {item.action}
                      </div>
                      {itemIndex < group.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
