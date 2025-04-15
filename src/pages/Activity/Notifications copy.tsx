import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: string;
  username: string;
  message: string;
  resumeLink: string;
  status: string;
  role: string;
  appliedOn: string;
}

const statusColors = {
  Pending: "bg-yellow-500",
  rejected: "bg-red-500",
  accepted: "bg-green-500",
};

const Notifications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const user = useSelector(
    (state: RootState) =>
      state.user.user as {
        username: string;
        userId: string;
      } | null
  );
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/application/rolepost/user/${
            user?.username
          }`
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [user]);

  const handleAccept = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "accepted" } : app
      )
    );
  };

  const handleReject = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "rejected" } : app
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      {applications.length === 0 ? (
        <div className="text-center p-4">No applications found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Applied On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.username}</TableCell>
                <TableCell>{app.message}</TableCell>
                <TableCell>{app.role}</TableCell>
                <TableCell>
                  {new Date(app.appliedOn).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      statusColors[app.status as keyof typeof statusColors] ||
                      "bg-gray-500"
                    } hover:bg-gray-700`}
                  >
                    {app.status || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={"./resume/" + app.id}
                    target="_blank"
                    className="text-blue-700"
                  >
                    View Resume
                  </a>
                </TableCell>
                <TableCell className="flex gap-4">
                  <Button onClick={() => handleAccept(app.id)}>Accept</Button>
                  <Button
                    variant={"secondary"}
                    onClick={() => handleReject(app.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Notifications;
