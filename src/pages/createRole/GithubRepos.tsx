// src/components/GithubRepos.tsx

;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { getRandomBadgeStyle } from "./BadgeStyles";
import { Badge } from "@/components/ui/badge";

export default function GithubRepos({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/github/repos`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch repositories");
        const data = await response.json();
        setRepos(data);
        setFilteredRepos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const handleSearch = (query: string) => {
    if (query.length === 0) {
      setFilteredRepos(repos);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = repos.filter((repo) =>
        repo.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredRepos(filtered);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between truncate">
          {value || "Select repository..."}
          <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-full max-w-96 w-dvw p-0">
        <Command>
          <CommandInput
            placeholder="Search repositories..."
            onInput={(e) => handleSearch(e.currentTarget.value)}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : filteredRepos.length === 0 ? (
              <CommandEmpty>No repositories found.</CommandEmpty>
            ) : (
              <ScrollArea className="h-[40dvh]">
                {filteredRepos.map((repo) => {
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
                      <Check className="mr-2 h-4 w-4" />
                      <span>{repo.name}</span>
                      <Badge
                        className={`${border} ${background} h-4 border text-black font-normal text-[10px] `}
                      >
                        {repo.private ? "Private" : "Public"}
                      </Badge>
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
