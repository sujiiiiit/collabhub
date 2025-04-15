import React, { useState, useEffect } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, File as FileIcon, Folder } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Gemini from "./Gemini";

export default function AI() {
  const params = useParams<{ userName: string, repoName: string }>();

  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(
    null
  );
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const pathSegments = selectedFilePath ? selectedFilePath.split("/") : [];

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/access-token`,
          {
            withCredentials: true,
          }
        );
        setAccessToken(response.data.accessToken);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchRootTree = async () => {
      const data = await fetchFileTree("");
      setFileTree(data);
    };

    fetchRootTree();
  }, [accessToken]);

  const fetchFileTree = async (path: string) => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${params.userName}/${params.repoName}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching file tree:", error);
      return [];
    }
  };

  const fetchFileContent = async (filePath: string) => {
    if (!accessToken) {
      console.error("Access token is missing");
      return "";
    }

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${params.userName}/${params.repoName}/contents/${filePath}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return atob(response.data.content);
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const [folderData, setFolderData] = useState<{ [path: string]: any[] }>({});

  const Tree = ({ item }: { item: any }) => {
    const isOpen = openFolders[item.path] || false;
    const children = folderData[item.path] || []; // Retrieve children for the current folder
    const isLoading = children.length === 0 && isOpen; // Show loading only when folder is open and empty

    const handleToggle = async () => {
      if (isOpen) {
        toggleFolder(item.path); // Close folder if already open
        return;
      }

      // Load children if not already fetched
      if (!folderData[item.path]) {
        try {
          const data = await fetchFileTree(item.path);
          setFolderData((prev) => ({
            ...prev,
            [item.path]: data, // Store fetched children in folderData
          }));
        } catch (error) {
          console.error("Error loading subdirectory content:", error);
        }
      }

      toggleFolder(item.path); // Open folder after fetching data
    };

    return (
      <SidebarMenuItem>
        <Collapsible className="group/collapsible" open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={handleToggle}
              className="hover:bg-black/10 truncate"
            >
              <ChevronRight
                className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              <Folder />
              <span className="truncate">{item.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {isLoading ? (
                <p className="px-4 py-2 text-gray-500">Loading...</p>
              ) : (
                children.map((childItem) =>
                  childItem.type === "dir" ? (
                    <Tree key={childItem.path} item={childItem} /> // Recursively render subfolders
                  ) : (
                    <SidebarMenuItem key={childItem.path}>
                      <SidebarMenuButton
                        onClick={async () => {
                          const content = await fetchFileContent(
                            childItem.path
                          );
                          setSelectedFileContent(content);
                          setSelectedFilePath(childItem.path);
                        }}
                        className="hover:bg-black/10 truncate"
                      >
                        <FileIcon />
                        <span className="truncate">{childItem.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  };

  const renderTree = (items: any[]) =>
    items.map((item) =>
      item.type === "dir" ? (
        <Tree key={item.path} item={item} />
      ) : (
        <SidebarMenuButton
          key={item.path}
          onClick={async () => {
            const content = await fetchFileContent(item.path);
            setSelectedFileContent(content);
            setSelectedFilePath(item.path);
          }}
          className="hover:bg-black/10 truncate"
        >
          <FileIcon />
          <span className="truncate">{item.name}</span>
        </SidebarMenuButton>
      )
    );

  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <SidebarProvider className="w-dvw">
        <Sidebar className="flex h-dvh">
          <SidebarHeader className="px-4 h-16 border-b bg-white">
            <Link
              to="/"
              className="text-[var(--ten)] font-extrabold text-3xl h-full flex items-center gap-2"
            >
              <img
                src="/assets/logo.svg"
                className="w-full max-w-32 h-16"
                alt="logo"
              />
              <Badge
                className="text-lg min-w-11 text-center font-bold bg-primary"
                variant="outline"
              >
                AI
              </Badge>
            </Link>
          </SidebarHeader>
          <ScrollArea>
            <SidebarContent className="px-2 bg-white">
              <SidebarGroup>
                <SidebarGroupLabel>Files</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>{renderTree(fileTree)}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </ScrollArea>
          <SidebarRail />
        </Sidebar>
        <main className="w-dvw">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <div className="w-full h-16 flex items-center border-b px-4 gap-4">
                <SidebarTrigger />
                {selectedFilePath && (
                  <Breadcrumb>
                    <BreadcrumbList>
                      {pathSegments.map((segment, index) => (
                        <React.Fragment key={index}>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="#">{segment}</BreadcrumbLink>
                          </BreadcrumbItem>
                          {index < pathSegments.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                )}
              </div>
              {selectedFileContent ? (
                <MonacoEditor
                  language="javascript"
                  value={selectedFileContent}
                  options={{ readOnly: true }}
                  className="w-dvw md:h-[calc(100dvh_-_4rem)] h-[100dvh_-_2rem]]"
                />
              ) : (
                <p className="md:h-[calc(100dvh_-_4rem)] h-[100dvh_-_2rem]] text-center flex items-center justify-center">
                  Select a file to view its content
                </p>
              )}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} maxSize={91}>
              <div className="w-full h-16 border-b px-4 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src="/assets/ai.svg" alt="" />
                  <h2>Ask to AI</h2>
                </div>
              </div>
              {/* chats here  */}
              <Gemini ownerId={params.userName || ''} repo={params.repoName || ''}/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </SidebarProvider>
    </div>
  );
}
