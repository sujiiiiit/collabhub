import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { jsPDF } from "jspdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RepoFile {
  name: string;
  type: string;
  path: string;
}

interface Message {
  role: "user" | "model";
  content: string;
}

interface ChatbotProps {
  repo: string;
  ownerId: string;
}

const MultiTenantChatbot: React.FC<ChatbotProps> = ({ repo, ownerId }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [repoContent, setRepoContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true); // Track scroll position
  const [_output, setOutput] = useState(""); // State for output
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  const githubToken = accessToken as string;
  const chatHistoryRef = useRef<HTMLDivElement>(null); // Reference for the scrollable area
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
    const fetchRepoFiles = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${ownerId}/${repo}/contents/`,
          {
            headers: { Authorization: `token ${githubToken}` },
          }
        );

        if (!res.ok) throw new Error(`GitHub API error: ${await res.text()}`);

        const files: RepoFile[] = await res.json();
        const contentPromises = files
          .filter((file) => file.type === "file")
          .map(async (file) => {
            const fileRes = await fetch(
              `https://api.github.com/repos/${ownerId}/${repo}/contents/${encodeURIComponent(
                file.path
              )}`,
              { headers: { Authorization: `token ${githubToken}` } }
            );
            if (!fileRes.ok)
              throw new Error(`Error fetching file: ${file.name}`);
            const fileData = await fileRes.json();
            return `File: ${file.name}\n\n${atob(fileData.content)}\n\n`;
          });

        const contentArray = await Promise.all(contentPromises);
        setRepoContent(contentArray.join(""));
        console.log("Repo content:", contentArray.join(""));
      } catch (err) {
        console.error("Error fetching repo files:", err);
      }
    };

    fetchRepoFiles();
  }, [repo, ownerId]);

  const handleGenerateDocumentation = async () => {
    try {
      setOutput("Generating documentation...");
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Generate a well-structured and complete documentation with sections for Readme.md, Project Overview, Table of Contents, Installation Instructions, Configuration, Usage, API Documentation, Database Schema, Features, Contributing, Testing, Deployment, Troubleshooting, Roadmap, License, Contact Information, and References.\n\n${repoContent}`,
            },
          ],
        },
      ];

      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContentStream({ contents });
      const buffer: string[] = [];

      for await (let response of result.stream) {
        buffer.push(response.text());
      }

      let documentationContent = buffer.join("");
      documentationContent = documentationContent
        .replace(/^#+/gm, "")
        .replace(/\*/g, "")
        .trim(); // Clean markdown

      setOutput(documentationContent);

      // Check if documentation content is empty before generating PDF
      if (documentationContent) {
        const doc = new jsPDF();
        doc.setFont("Times", "normal"); // Set the font to Times New Roman, normal style
        doc.setFontSize(12); // Set font size to 12

        const lines = doc.splitTextToSize(documentationContent, 180); // Split text to fit page width
        let y = 10; // Initial vertical position

        // Make the first line bold
        if (lines.length > 0) {
          doc.setFont("Times", "bold");
          doc.setFontSize(14); // Set font to bold for the first line
          doc.text(lines[0], 10, y); // Add the first line
          y += 10; // Move down after the first line
        }
        doc.setFont("Times", "normal");
        doc.setFontSize(12); // Reset font to normal for the rest of the text

        // Render the rest of the lines
        lines.slice(1).forEach((line: any) => {
          // Check if the line will fit on the current page
          if (y + 10 > doc.internal.pageSize.height) {
            // 10 is the line height
            doc.addPage(); // Add a new page
            y = 10; // Reset y position for new page
          }

          // Apply logic for headings based on section titles (e.g., bold headings)
          if (
            line.match(
              /^\s*(README.md|Project Overview|Table of Contents|Installation Instructions|Configuration|Usage|API Documentation|Database Schema|Features|Contributing|Testing|Deployment|Troubleshooting|Roadmap|License|Contact Information|References)\s*$/i
            )
          ) {
            doc.setFont("Times", "bold"); // Set font to bold for section titles
            doc.setFontSize(14); // Increase font size for headings
          } else {
            doc.setFont("Times", "normal"); // Set font to normal for regular text
            doc.setFontSize(12); // Normal font size for regular content
          }

          doc.text(line, 10, y); // Add line to the PDF
          y += 10; // Move down for the next line
        });

        doc.save(`${repo}_documentation.pdf`); // Save the PDF
      }
    } catch (e) {
      console.error("Error generating documentation:", e);
      setOutput(
        e instanceof Error ? e.message : "An unexpected error occurred"
      );
    }
  };

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!prompt.trim()) return;

    const newMessage: Message = { role: "user", content: prompt };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setPrompt("");
    setLoading(true);

    try {
      const conversation = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));
      const fullPrompt = `Repo Content:\n\n${repoContent}\n\nConversation:\n${conversation
        .map((m) => `${m.role}: ${m.parts[0].text}`)
        .join("\n")}`;

      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      const contents = [{ role: "user", parts: [{ text: fullPrompt }] }];

      const result = await model.generateContentStream({ contents });

      const buffer: string[] = [];
      for await (const response of result.stream) buffer.push(response.text());

      const assistantMessage: Message = {
        role: "model",
        content: buffer.join(""),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to manage scroll position
  useEffect(() => {
    const chatContainer = chatHistoryRef.current;
    if (chatContainer) {
      const handleScroll = () => {
        const isAtBottom =
          chatContainer.scrollHeight - chatContainer.scrollTop ===
          chatContainer.clientHeight;
        setIsAtBottom(isAtBottom);
      };

      chatContainer.addEventListener("scroll", handleScroll);

      // Cleanup
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Effect to auto-scroll to bottom if needed
  useEffect(() => {
    if (isAtBottom) {
      const chatContainer = chatHistoryRef.current;
      chatContainer?.scrollTo(0, chatContainer.scrollHeight); // Auto-scroll to bottom
    }
  }, [messages, loading, isAtBottom]); // Trigger auto-scroll on new messages or loading

  return (
    <div className="chat-container flex flex-col max-w-2xl mx-auto h-screen">
      <ScrollArea
        className="chat-history h-[calc(100dvh_-_8rem)] p-4 overflow-y-auto bg-white rounded-b-lg"
        ref={chatHistoryRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block text-sm px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 text-white"
                  : "bg-black/5 text-black"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-base shimmer">thinking...</div>
        )}
      </ScrollArea>
      <div className="w-full flex items-center border-t  h-16 p-4 gap-2 ">
        <form onSubmit={handleSubmit} className="w-full flex items-center h-16">
          <input
            type="text"
            placeholder="Type your message..."
            value={prompt}
            onChange={(ev) => setPrompt(ev.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />

          <Button
            type="submit"
            size={"icon"}
            
            className={`ml-2 rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            disabled={loading}
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"></path></svg>
          </Button>
        </form>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size={"icon"}
                className=" aspect-square"
                variant={"secondary"}
                onClick={() => {
                  handleGenerateDocumentation();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z"></path>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MultiTenantChatbot;
