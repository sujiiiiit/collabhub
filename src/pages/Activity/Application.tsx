import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type JobApplication = {
  rolePostId?: string;
  role?: string;
  appliedOn?: string;
  status?: "pending" | "Interviewed" | "rejected" | "accepted";
};

const statusColors = {
  pending: "bg-yellow-500",
  Interviewed: "bg-blue-500",
  rejected: "bg-red-500",
  accepted: "bg-green-500",
};

export default function JobApplicationsTable() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.user.user?._id);

  const fetchApplicationDetails = async (applicationId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/application/${applicationId}`
      );
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch details for application ${applicationId}:`, err);
      return null; // Handle missing data gracefully
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (!userId) {
        setError("User ID is missing. Please log in.");
        return;
      }

      try {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`
        );

        if (!userResponse.data.applied || !Array.isArray(userResponse.data.applied)) {
          throw new Error("Applied data is not in the expected format.");
        }

        const appliedIds = userResponse.data.applied;

        const detailedApplications = await Promise.all(
          appliedIds.map(async (id: string) => {
            const details = await fetchApplicationDetails(id);
            return details || {}; // Fallback to empty object if data is missing
          })
        );

        setJobApplications(detailedApplications);
      } catch (err: any) {
        console.error("Failed to fetch applications:", err.message);
        setError("Failed to fetch applications. Please try again later.");
      }
    };

    fetchApplications();
  }, [userId]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">My Job Applications</h1>
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>A list of your recent job applications</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Role Post ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobApplications.length > 0 ? (
                jobApplications.map((app, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {app.rolePostId ? app.rolePostId.slice(24) : "N/A"}
                    </TableCell>
                    <TableCell>{app.role || "N/A"}</TableCell>
                    <TableCell>
                      {app.appliedOn
                        ? new Date(app.appliedOn).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`${
                          statusColors[app.status as keyof typeof statusColors] || "bg-gray-500"
                        } text-white`}
                      >
                        {app.status || "Unknown"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No job applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
