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
  pending: "bg-yellow-500",
  rejected: "bg-red-500",
  accepted: "bg-green-500",
};

const Notifications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [_previousStatus, setPreviousStatus] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
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

  const updateApplicationStatus = async (id: string, status: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/application/status/${id}`,
        { status }
      );
      setApplications(
        applications.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (error) {
      console.error(`Error updating application status:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAccept = (id: string) => {
    setPreviousStatus((prev) => ({ ...prev, [id]: "pending" }));
    updateApplicationStatus(id, "accepted");
  };

  const handleReject = (id: string) => {
    setPreviousStatus((prev) => ({ ...prev, [id]: "pending" }));
    updateApplicationStatus(id, "rejected");
  };

  const handleUndo = (id: string) => {
    updateApplicationStatus(id, "pending");
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
                  {app.status === "pending" ? (
                    <>
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        onClick={() => handleAccept(app.id)}
                        className="flex items-center gap-2"
                      >
                        {loading[app.id] ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        )}
                        Accept
                      </Button>
                      <Button
                        size={"icon"}
                        variant={"destructive"}
                        onClick={() => handleReject(app.id)}
                        className="flex border bg-transparent items-center gap-2"
                      >
                        {loading[app.id] ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="flex border bg-transparent text-black items-center gap-2"
                      onClick={() => handleUndo(app.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m15 15-6 6m0 0-6-6m6 6V9a6 6 0 0 1 12 0v3"
                        />
                      </svg>
                      Undo
                    </Button>
                  )}
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
