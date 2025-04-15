;

import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

const formSchema = z.object({
  message: z.string().min(1, "This field is required"),
  resume: z.instanceof(FileList),
});

interface ApplyProps {
  postId: string;
  moreData: {
    role: string;
    [key: string]: any;
  };
  createdBy: string;
}

const Apply: React.FC<ApplyProps> = ({ postId, moreData, createdBy }) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.user.user);
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 600px)");
  const userName = useSelector(
    (state: RootState) => state.user.user?.username ?? null
  );
  const [isApplied, setIsApplied] = useState<boolean>(false);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!userName) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/application/check/${userName}/${postId + userName}`
        );
        if (response) {
          setIsApplied(response.data.applied);
          console.log(response.data.applied);
        }
      } catch (error) {
        console.error("Failed to check application status:", error);
      }
    };

    checkApplicationStatus();
  }, [userName]);

  const isSameUser = userName === createdBy;

  if (isAuthenticated) {
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={isApplied || isSameUser}
              className="bg-primary lg:w-auto w-[calc(100%_-_16px)] text-black hover:border-black hover:border hover:outline-none hover:shadow-[4px_4px_0_0_#000] hover:transform hover:translate-x-[-4px] hover:translate-y-[-4px] mx-2 "
            >
              {isApplied  ? "Applied" : "Collaborate Now"}
             
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:rounded-none">
            <DialogHeader>
              <DialogTitle>Apply</DialogTitle>
            </DialogHeader>
            <ProfileForm
              open={open}
              setOpen={setOpen}
              className="flex flex-col gap-2"
              postId={postId}
              moreData={moreData}
              createdBy={createdBy}
            />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={isApplied || isSameUser}
            className="bg-primary lg:w-auto w-[calc(100%_-_16px)] text-black hover:border-black hover:border hover:outline-none hover:shadow-[4px_4px_0_0_#000] hover:transform hover:translate-x-[-4px] hover:translate-y-[-4px] mx-2"
          >
            {isApplied || isSameUser ? "Applied" : "Collaborate Now"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Apply</DrawerTitle>
          </DrawerHeader>
          <ProfileForm
            open={open}
            setOpen={setOpen}
            className="px-4 flex flex-col gap-2"
            postId={postId}
            moreData={moreData}
            createdBy={createdBy}
          />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>
            <Button className="bg-primary lg:w-auto w-[calc(100%_-_16px)] text-black hover:border-black hover:border hover:outline-none hover:shadow-[4px_4px_0_0_#000] hover:transform hover:translate-x-[-4px] hover:translate-y-[-4px] mx-2">
              Collaborate Now
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to Continue</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

interface ProfileFormProps {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  postId: string;
  moreData: {
    role: string;
    [key: string]: any;
  };
  createdBy: string;
}

function ProfileForm({
  className,
  
  postId,
  moreData,
  createdBy,
  setOpen,
}: ProfileFormProps & React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  const userName = useSelector(
    (state: RootState) => state.user.user?.username ?? null
  );

  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/application/submit`,
        {
          ...values,
          message: values.message,
          resume: values.resume[0],
          rolePostId: postId + userName,
          username: userName,
          role: moreData["role"],
          createdBy: createdBy,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Applied successfully");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit the form.");
    }
  };

  const fileRef = form.register("resume");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introduction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write why you want to be part of our project..."
                  className="resize-none rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resume"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Choose a file"
                  {...fileRef}
                  onChange={(event) => {
                    field.onChange(event.target?.files?.[0] ?? undefined);
                  }}
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default Apply;
