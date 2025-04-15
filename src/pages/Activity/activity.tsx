import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notification from "@/pages/Activity/Notifications"
import JobApplicationsTable from "./Application";
import Role from "./role";
export default function Activity() {
  return (
    <>
      {/* tabs section */}
      <Tabs id="homeTabs" defaultValue={"application"} className="pt-10">
        <div className="relative w-full border-b flex max-w-6xl m-auto">
          <TabsList >
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="createdRoles">Created roles</TabsTrigger>
            <TabsTrigger value="Notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>
        <div className="w-full max-w-6xl m-auto p-4 relative">
          <TabsContent value="application">
            <JobApplicationsTable/>
          </TabsContent>
          <TabsContent value="createdRoles">
           <Role/>
          </TabsContent>
          <TabsContent value="Notifications">
            <Notification/>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
