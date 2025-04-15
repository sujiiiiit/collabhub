import React, { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Apply from "@/pages/components/apply";
import { Link } from "react-router-dom";

// Define an interface for the props
interface RoleDetailProps {
  id: string;
}
interface Details {
  id: string;
  userId: string;
  roles: string[];
  address: string;
  createdAt: string;
  techPublic: boolean;
  techStack: string[];
  username: string;
  repoLink:string;
}

const RoleDetail: React.FC<RoleDetailProps> = ({ id }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [htmlOutput, setHtmlOutput] = useState<string>("");
  const [details, setDetails] = useState<Details | null>(null);
  const [username, setUsername] = useState<string>("");

  const editor = useCreateBlockNote();

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/rolepost/id/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch role details");

        const data = await response.json();
        editor.replaceBlocks(editor.document, data.description);
        const htmlFromBlocks = await editor.blocksToFullHTML(data.description);

        setHtmlOutput(htmlFromBlocks);
        setDetails(data);

        // Fetch username after fetching role details
        const userResponse = await fetch(
          `http://localhost:5000/api/users/${data.userId}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        setUsername(userData.username);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [editor, id]);

  const repoLink = details?.repoLink;
const shortRepoPath = repoLink?.replace(/^https?:\/\/github\.com\//, '');

  return (
    <ScrollArea className="md:h-[calc(100dvh_-_2rem)] h-[calc(100dvh_-_7rem)] justify-between md:border md:mt-2 rounded-[8px] px-5 md:top-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          
          <div
            className="md:sticky md:top-0 flex lg:flex-row flex-col lg:gap-0 gap-3 justify-between py-5 bg-white z-20"
            ref={(el) => {
              if (el) {
                const height = el.getBoundingClientRect().height;
                if (window.innerWidth >= 786) {
                  el.style.setProperty("height", `${height}px`);
                }
              }
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center gap-2 ">
                {username && (
                  <div
                    className="w-8 h-8 rounded-full border bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://github.com/${username}.png)`,
                    }}
                  ></div>
                )}
                <div className="flex flex-col ">
                  <a href="#" className="text-lg font-medium text-black/80">
                    {username}
                  </a>
                  <div className="text-sm  text-black/80 truncate">
                    {details?.address}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-auto sticky w-full flex lg:flex-row  flex-row-reverse top-0 gap-2">
              <span>
                {details && (
                  <Link to={`/ai/${shortRepoPath}`}>
                    <Button size={"icon"} variant={"secondary"}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path></svg>
                    </Button>
                  </Link>
                )}
              </span>

              {/* <Button className="bg-muted" size={"icon"} variant={"ghost"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
                </svg>
              </Button> */}
              <Apply createdBy= {username} postId={id} moreData={details ? { ...details, role: details.roles.join(", ") } : { role: "" }} />
            </div>
          </div>
          <div className="text-3xl font-medium mt-2">
            {details ? details.roles.join(", ") : ""}
          </div>
          <div className={"wrapper"}>
            <div className={"item"}>
              <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
            </div>
          </div>
        </>
      )}
    </ScrollArea>
  );
};

export default RoleDetail;
