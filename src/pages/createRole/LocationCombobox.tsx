// src/components/LocationCombobox.tsx

;
import { useState } from "react";
import axios from "axios";
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

export default function LocationCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(suggestions)

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
          params: { key: API_KEY, q: query, limit: 5, format: "json" },
        }
      );
      setSuggestions([
        { place_id: "remote", display_name: "Remote Location" },
        ...response.data,
      ]);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between truncate">
          {value || "Select address..."}
          <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                {suggestions.map(
                  (suggestion) =>
                    suggestion && (
                      <CommandItem
                        key={suggestion.place_id}
                        value={suggestion.display_name}
                        onSelect={() => {
                          onChange(suggestion.display_name);
                          setOpen(false);
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        <span>{suggestion.display_name}</span>
                      </CommandItem>
                    )
                )}
              </ScrollArea>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
