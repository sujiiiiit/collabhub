;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { RootState } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";




export default function Component() {
  const navigate = useNavigate();

  interface JobRole {
    id: string;
    roles: string[];
    deadline: string;
    applicants?: number;
    createdAt?:string;
  }

  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const userId = useSelector((state: RootState) => state.user.user?._id);

  // Fetch dynamic data from the API
  useEffect(() => {
    const fetchJobRoles = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/rolepost/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch job roles");
        
        const data = await response.json();
        setJobRoles(data); // Assuming the API returns an array
      } catch (error) {
        console.error("Error fetching job roles:", error);
      }
    };

    fetchJobRoles();
  }, [userId]);

  // Function to delete a job role
  const deleteRole = (id: string) => {
    setJobRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
  };
  const handleEdit = (id: string) => {
    navigate(`/update/${id}`);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Job Roles Dashboard</h1>
        <Link to={"/create"}>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Role
        </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Posted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobRoles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {role.roles.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(role.deadline).toLocaleDateString()}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(role.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                   
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
