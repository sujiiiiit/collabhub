import * as React from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import JobDurationSlider from "@/components/ui/double-slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group-check";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 786px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M176,80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H184A8,8,0,0,1,176,80ZM40,88H144v16a8,8,0,0,0,16,0V56a8,8,0,0,0-16,0V72H40a8,8,0,0,0,0,16Zm176,80H120a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16ZM88,144a8,8,0,0,0-8,8v16H40a8,8,0,0,0,0,16H80v16a8,8,0,0,0,16,0V152A8,8,0,0,0,88,144Z"></path>
            </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 sm:max-w-[425px] !rounded-sm border-2 border-black/90">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="md:text-3xl">Filter Roles</DialogTitle>
            <DialogDescription>
              Filter roles by selecting the options below and{" "}
              <span className="text-[var(--ten)]">Apply</span>
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path d="M176,80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H184A8,8,0,0,1,176,80ZM40,88H144v16a8,8,0,0,0,16,0V56a8,8,0,0,0-16,0V72H40a8,8,0,0,0,0,16Zm176,80H120a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16ZM88,144a8,8,0,0,0-8,8v16H40a8,8,0,0,0,0,16H80v16a8,8,0,0,0,16,0V152A8,8,0,0,0,88,144Z"></path>
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter Roles</DrawerTitle>
          <DrawerDescription>
            Filter roles by selecting the options below and{" "}
            <span className="text-[var(--ten)]">Apply</span>{" "}
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild className="mt-0">
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <>
      <form action="" className={className}>
        <div className="flex justify-between items-center py-3 border-b  ">
          <div className="w-full flex justify-between items-center px-6">
            <Label className="text-md text-normal ">Remote only</Label>
            <Switch id="remoteOnly" />
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-6">Duration</AccordionTrigger>
            <AccordionContent>
              <JobDurationSlider />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="px-6">Date Posted</AccordionTrigger>
            <AccordionContent className="!overflow-y-auto">
              <RadioGroup defaultValue="option-one">
                <Label
                  htmlFor="option-one"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Any Time
                  </span>
                  <RadioGroupItem value="option-one" id="option-one" />
                </Label>
                <Label
                  htmlFor="option-two"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Last day
                  </span>
                  <RadioGroupItem value="option-two" id="option-two" />
                </Label>
                <Label
                  htmlFor="option-three"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Last 3 days
                  </span>
                  <RadioGroupItem value="option-three" id="option-three" />
                </Label>
                <Label
                  htmlFor="option-four"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Last week
                  </span>
                  <RadioGroupItem value="option-four" id="option-four" />
                </Label>
                <Label
                  htmlFor="option-five"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Last 2 weeks
                  </span>
                  <RadioGroupItem value="option-five" id="option-five" />
                </Label>
                <Label
                  htmlFor="option-six"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Last month
                  </span>
                  <RadioGroupItem value="option-six" id="option-six" />
                </Label>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="px-6">Category</AccordionTrigger>
            <AccordionContent>
              <RadioGroup defaultValue="c-all">
                <Label
                  htmlFor="c-all"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">All</span>
                  <RadioGroupItem value="c-all" id="c-all" />
                </Label>
                <Label
                  htmlFor="c-one"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Website developer
                  </span>
                  <RadioGroupItem value="c-one" id="c-one" />
                </Label>
                <Label
                  htmlFor="c-two"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Mobile developer
                  </span>
                  <RadioGroupItem value="c-two" id="c-two" />
                </Label>
                <Label
                  htmlFor="c-three"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    API developer
                  </span>
                  <RadioGroupItem value="c-three" id="c-three" />
                </Label>
                <Label
                  htmlFor="c-four"
                  className="flex w-full items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted"
                >
                  <span className="w-full h-full flex items-center">
                    Graphic designer
                  </span>
                  <RadioGroupItem value="c-four" id="c-four" />
                </Label>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="md:px-6 px-4 md:pb-6 pt-6 flex gap-2">
          <Button variant={"outline"} className="w-full">
            Clear
          </Button>
          <Button className="w-full bg-primary text-black">Apply</Button>
        </div>
      </form>
    </>
  );
}

export function CategoryFilter() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const categories = [
    {
      value: "website-developer",
      label: "Website Developer",
    },
    {
      value: "mobile-developer",
      label: "Mobile Developer",
    },
    {
      value: "api-developer",
      label: "API Developer",
    },
    {
      value: "graphic-designer",
      label: "Graphic Designer",
    },
    {
      value: "data-scientist",
      label: "Data Scientist",
    },
  ];
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="h-8">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit justify-between rounded-full border-0 bg-muted"
          >
            {value
              ? categories.find((category) => category.value === value)?.label
              : "Category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Category..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <button
        className={`rounded-full h-8 px-6  transition-colors ${
          isActive
            ? "bg-primary border"
            : "bg-secondary"
        }`}
        onClick={() => setIsActive(!isActive)}
        role="switch"
        aria-checked={isActive}
      >
        Paid
      </button>
      
    </>
  );
}
