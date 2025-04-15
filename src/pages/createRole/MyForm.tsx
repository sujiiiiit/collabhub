// src/components/MyForm.tsx

;
import React, { useState, useEffect, SetStateAction } from "react";
import LocationCombobox from "./LocationCombobox";
import GithubRepos from "./GithubRepos";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import JobDurationSlider from "@/components/ui/double-slider";

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
import { BlockNoteEditor } from "@blocknote/core";


import { SimpleDatetimeInput } from "@/components/ui/extension/datetime-picker";
import Editor from "@/pages/createRole/Editor";

const formSchema = z.object({
  pName: z.string(),
  techStack: z.array(z.string()).nonempty(),
  techPublic: z.boolean().optional(),
  roles: z.array(z.string()).nonempty(),
  address: z.string().nonempty(),
  repoLink: z.string().nonempty("Select a repository"),
});

export default function MyForm() {
  const [_rolesData, setRolesData] = useState<
    { roleId: string; name: string }[]
  >([]);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      techStack: ["React"],
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/rolePost",
        {
          ...values,
          description: editor,
          duration: selectedRange,
          deadline: selectedDateTime,
          userId,
        }
      );
      console.log(response);
      toast.success("Role created successfully");
    } catch (error) {
      toast.error("Failed to submit the form.");
    }
  };

  useEffect(() => {
    // Fetch the roles data
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_URL + "/api/roles"
        );
        setRolesData(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);
  const handleRangeChange = (newRange: SetStateAction<number[]>) =>
    setSelectedRange(newRange);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative max-w-6xl mx-auto py-4 flex gap-4 lg:px-0 px-4 "
        >
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
                  <FormLabel>GIthub Repository</FormLabel>
                  <FormControl>
                    <GithubRepos
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select <span className="underline">Remote</span> for remote
                    work
                  </FormDescription>
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
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select languages" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          <MultiSelectorItem value="React">
                            React
                          </MultiSelectorItem>
                          <MultiSelectorItem value="Vue">Vue</MultiSelectorItem>
                          <MultiSelectorItem value="Svelte">
                            Svelte
                          </MultiSelectorItem>
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
                    <FormDescription>
                      You can change it from settings
                    </FormDescription>
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
                          {/* {rolesData.map((role) => (
                        <MultiSelectorItem
                          key={role.roleId}
                          value={role.roleId}
                        >
                          {role.name}
                        </MultiSelectorItem>
                      ))} */}
                          <MultiSelectorItem value="Website Developer">
                            Website Developer
                          </MultiSelectorItem>
                          <MultiSelectorItem value="Graphic Designer">
                            Graphic Designer
                          </MultiSelectorItem>
                          <MultiSelectorItem value="Mobile Developer">
                            Mobile Developer
                          </MultiSelectorItem>
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
                    <LocationCombobox
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select <span className="underline">Remote</span> for remote
                    work
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
              <Editor onEditorReady={setEditor} />
            </ScrollArea>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
