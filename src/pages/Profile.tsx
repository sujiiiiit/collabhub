// In frontend/src/pages/Profile.tsx
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Github } from "lucide-react";

export default function DeveloperProfile() {
  const { username } = useParams<{ username: string }>();
  const [developer, setDeveloper] = useState<any>(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/username/${username}`
        );
        setDeveloper(response.data);
      } catch (error) {
        console.error("Error fetching developer data:", error);
      }
    };

    if (username) {
      fetchDeveloper();
    }
  }, [username]);

  if (!developer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={`https://github.com/${username}.png`} alt={developer.name} />
            
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-3xl">{developer.name}</CardTitle>
            <CardDescription className="text-xl">
              @{developer.username}
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-auto">
            <Link to={`mailto:${developer.email}`}>
            <Button size="icon" variant="outline" aria-label="Send email">
              <Mail className="h-4 w-4" />
            </Button>
            </Link>
            <Link to={`https://github.com/${username}`}>
            <Button
              size="icon"
              variant="outline"
              aria-label="View GitHub profile"
            >
              <Github className="h-4 w-4" />
            </Button>
            </Link>
           
          </div>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  );
}
