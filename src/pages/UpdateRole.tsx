;
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SetStateAction, useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import JobDurationSlider from "@/components/ui/double-slider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SimpleDatetimeInput } from "@/components/ui/extension/datetime-picker";
import React from "react";
import { Badge } from "@/components/ui/badge";


//block note editor
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";

// Import the necessary Gemini Flash libraries
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  pName: z.string(),
  techStack: z.array(z.string()).nonempty(),
  techPublic: z.boolean().optional(),
  roles: z.array(z.string()).nonempty(),
  address: z.string().nonempty(),
  repoLink: z.string().nonempty("Select a repository"),
});

export function ComboboxDemo({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch location suggestions using LocationIQ API
  const fetchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;
      const response = await axios.get(
        `https://api.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: API_KEY,
            q: query,
            limit: 5,
            format: "json",
          },
        }
      );

      const remoteOption = {
        place_id: "remote",
        display_name: "remote",
        display_place: "Remote Location",
        display_address: "Remote",
      };

      const updatedSuggestions = [remoteOption, ...response.data];
      setSuggestions(updatedSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }

    setLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
        >
          {value ? value : "Select address..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-fit w-dvw p-0">
        <Command>
          <CommandInput
            placeholder="Search address..."
            onInput={(e) => fetchLocation(e.currentTarget.value)}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>No addresses found.</CommandEmpty>
            ) : (
              <ScrollArea className="h-[40dvh]">
                <CommandGroup>
                  {suggestions.map((suggestion: any) => (
                    <CommandItem
                      key={suggestion.place_id}
                      value={suggestion.display_name}
                      onSelect={() => {
                        onChange(suggestion.display_name);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === suggestion.display_name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {/* Display the place name if available, otherwise show display_name */}
                      <div>
                        <span className="font-medium">
                          {suggestion.display_place || suggestion.address.name}
                        </span>
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {suggestion.display_address ||
                            suggestion.display_name}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const badgeStyles = [
  { background: "bg-red-500/20", border: "border-red-700" },
  { background: "bg-green-500/20", border: "border-green-700" },
  { background: "bg-blue-500/20", border: "border-blue-700" },
  { background: "bg-yellow-500/20", border: "border-yellow-700" },
  { background: "bg-purple-500/20", border: "border-purple-700" },
];

function getRandomBadgeStyle() {
  const randomIndex = Math.floor(Math.random() * badgeStyles.length);
  return badgeStyles[randomIndex];
}

export function GithubRepos({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/github/repos`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepos(data);
        setFilteredRepos(data); // Initially display all repositories
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Filter the repositories based on the search query
  const handleSearch = (query: string) => {
    if (query.length === 0) {
      setFilteredRepos(repos); // Show all repositories if query is empty
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = repos.filter((repo: any) =>
        repo.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredRepos(filtered);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
        >
          {value ? value : "Select repository..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-full max-w-96 w-dvw p-0">
        <Command>
          <CommandInput
            placeholder="Search repositories..."
            onInput={(e) => handleSearch(e.currentTarget.value)} // Use input to filter the repos
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : filteredRepos.length === 0 ? (
              <CommandEmpty>No repositories found.</CommandEmpty>
            ) : (
              <ScrollArea className="h-[40dvh]">
                <CommandGroup>
                  {filteredRepos.map((repo: any) => {
                    const { background, border } = getRandomBadgeStyle();
                    return (
                      <CommandItem
                        key={repo.id}
                        value={repo.html_url}
                        onSelect={() => {
                          onChange(repo.html_url);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === repo.html_url
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {/* Display the repository name */}
                        <div className="flex flex-col gap-[2px] overflow-hidden w-full">
                          <div className="flex gap-2 w-full">
                            <span className="font-medium">{repo.name}</span>
                            <Badge
                              className={`${border} ${background} h-4 border text-black font-normal text-[10px] `}
                            >
                              {repo.private ? "Private" : "Public"}
                            </Badge>
                          </div>

                          <span className="text-xs text-muted-foreground truncate">
                            {repo.html_url}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Function to handle Gemini API streaming and parse each chunk of Markdown to blocks
const streamFromGemini = async (inputText: string, editor: BlockNoteEditor) => {
  try {
    const API_KEY = "AIzaSyBfu0zPKsyao5Rm1pJlUyPll-ym8W5TKR0"; // Replace with your actual API key
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: inputText }] }],
    });

    let accumulatedMarkdown = "";
    for await (let response of result.stream) {
      const chunk = response.text();
      accumulatedMarkdown += chunk;

      // Convert the accumulated Markdown to blocks in real time
      const blocks = await editor.tryParseMarkdownToBlocks(accumulatedMarkdown);
      editor.replaceBlocks(editor.document, blocks);
    }
  } catch (e) {
    console.error("Error generating content:", (e as Error).message);
  }
};

const contentWritingPrompt = `
    You are a professional content writer specializing in creating engaging, well-researched, and informative content. categorize the question asked and if it is about your name answer that you are "CollabHub AI Assistant" adn addition what you can do.
    Follow these guidelines when generating content:
    Note: dont use h1 headings instead start from h3 and for remaiing content use lower headings like h4 h5 and h6
    1. Start with a catchy introduction to hook the reader.
    2. Structure the content into clear sections with proper headings and subheadings.
    3. Ensure the content is relevant and up-to-date, backed by reliable sources when needed.
    4. Use a friendly and approachable tone to engage the target audience.
    5. Provide actionable tips, insights, or solutions where applicable.
    6. Use bullet points, lists, or numbered steps to enhance readability.
    7. End with a concise conclusion that summarizes the main points and includes a call-to-action if relevant.
    
    Your content should be SEO-friendly with natural use of keywords, but avoid keyword stuffing. Prioritize clarity, flow, and value to the reader.
  
    Topic: "{topic}"
  `;

const insertMagicAi = (editor: BlockNoteEditor) => {
  const prevText = editor._tiptapEditor.state.doc.textBetween(
    Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
    editor._tiptapEditor.state.selection.from - 1,
    "\n"
  );
  const prompt = contentWritingPrompt.replace(
    "{topic}",
    prevText || "general content topic"
  );

  streamFromGemini(prompt, editor);
};

const insertMagicItem = (editor: BlockNoteEditor) => ({
  title: "Insert Magic Text",
  onItemClick: async () => {
    insertMagicAi(editor);
  },
  aliases: ["autocomplete", "ai"],
  group: "AI",
  icon: (
    <svg
      fill="none"
      width={24}
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <path
        d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
        fill="url(#prefix__paint0_radial_980_20147)"
      />
      <defs>
        <radialGradient
          id="prefix__paint0_radial_980_20147"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
        >
          <stop offset=".067" stopColor="#9168C0" />
          <stop offset=".343" stopColor="#5684D1" />
          <stop offset=".672" stopColor="#1BA1E3" />
        </radialGradient>
      </defs>
    </svg>
  ),
  subtext: "Continue your note with AI-generated text",
});

// Update the function to place the AI item first in the menu
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  insertMagicItem(editor), // Add AI item first
  ...getDefaultReactSlashMenuItems(editor), // Then add other items
];

export default function UpdateRole() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [rolesData, setRolesData] = useState<
    { roleId: string; name: string }[]
  >([]);
  interface RolesData {
    description: any;
  }

  const [roleDetails, setRoleDetails] = useState<RolesData | null>(null);

  const [techStackData, setTechStackData] = useState<
    { stackId: string; name: string }[]
  >([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      techStack: [],
      roles: [],
      address: "",
    },
  });

  const userId = useSelector(
    (state: RootState) => state.user.user?._id ?? null
  );
  const [selectedRange, setSelectedRange] = useState([30, 180]);
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date>(
    new Date()
  );
 

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/rolePost/id/${id}`
        );
        form.reset(response.data);
        setRoleDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching role details:", error);
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/roles`
        );
        setRolesData(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchTechStack = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/techstack`
        );
        setTechStackData(response.data);
      } catch (error) {
        console.error("Error fetching tech stack:", error);
      }
    };

    fetchRoleDetails();
    fetchRoles();
    fetchTechStack();
  }, [id, form]);

  const { audio, image, ...remainingBlockSpecs } = defaultBlockSpecs;
 
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      // remainingBlockSpecs contains all the other blocks
      ...remainingBlockSpecs,
      audio,
      image,
    },
  });
 
  // Creates a new editor instance with the schema
  const editor = useCreateBlockNote({
    schema,
    initialContent: roleDetails?.description,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/rolePost/update/${id}`,
        {
          ...values,
          description: editor.document,
          duration: selectedRange,
          deadline: selectedDateTime,
          userId,
        }
      );
      console.log(response);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to submit the form.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleRangeChange = (newRange: SetStateAction<number[]>) =>
    setSelectedRange(newRange);
//   const editor = useCreateBlockNote();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative max-w-6xl mx-auto py-4 flex gap-4 lg:px-0 px-4 ">
      <div className="w-full flex flex-col gap-7 pb-16">

        <FormField
          control={form.control}
          name="pName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Repository</FormLabel>
              <FormControl>
                <Input placeholder="Enter repository link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech stack</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value || []}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select technologies" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {techStackData.map((tech) => (
                        <MultiSelectorItem key={tech.stackId} value={tech.name}>
                          {tech.name}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techPublic"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Make technologies visible</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select roles" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {rolesData.map((role) => (
                        <MultiSelectorItem key={role.roleId} value={role.name}>
                          {role.name}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work address</FormLabel>
              <FormControl>
                <ComboboxDemo value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Select <span className="underline">Remote</span> for remote work
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

<div>
            <Label>Duration</Label>
            <div className="border rounded-md py-3">
              <JobDurationSlider onRangeChange={handleRangeChange} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Set a deadline</Label>
            <SimpleDatetimeInput
              onValueChange={setSelectedDateTime}
              disablePastDates={true}
            />
          </div>
        </div>

        <div
          id="desc"
          className=" md:sticky md:top-4  w-full flex flex-col gap-2 h-[calc(100dvh_-_6rem)]"
        >
          <Label>Description</Label>
          <ScrollArea className=" w-full  rounded-md border p-2 h-[calc(100dvh_-_6rem)]">
            <BlockNoteView
              editor={editor}
              slashMenu={false}
              theme={lightDefaultTheme}
            >
              <SuggestionMenuController
                triggerCharacter={"/"}
                getItems={async (query) =>
                  filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                }
              />
            </BlockNoteView>
          </ScrollArea>
          <Button type="submit" className="text-black">Submit</Button>
        </div>

      </form>
    </Form>
  );
}
