import { Route, Routes, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthRoute from "@/components/AuthRoute";
import Header from "./components/Header";
import CreateRole from "@/pages/CreateRole";
import Repos from "@/pages/Repos";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Activity from "@/pages/Activity/activity";
import AI from "@/pages/ai/ai";
import Resume from "@/pages/Activity/Resume";
import UpdateRole from "@/pages/UpdateRole";

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/resume", "/ai"];

  return (
    <ScrollArea className="relative w-full h-dvh">
      {!hideHeaderRoutes.some((route) =>
        location.pathname.startsWith(route)
      ) && <Header />}

      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/activity" element={<AuthRoute component={Activity} />} />
        <Route path="/repo" element={<Repos />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/create" element={<AuthRoute component={CreateRole} />} />
        <Route
          path="/ai/:userName/:repoName"
          element={<AuthRoute component={AI} />}
        />
        <Route path="/resume/:id" element={<Resume />} />
        <Route path="/update/:id" element={<UpdateRole />} />
      </Routes>
    </ScrollArea>
  );
}

export default App;
