;

import { cn } from "@/lib/utils";

import { cva, type VariantProps } from "class-variance-authority";

import React from "react";

export interface AvatarCirclesProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  asChild?: boolean;
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const variants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const AvatarCircles = React.forwardRef<HTMLButtonElement, AvatarCirclesProps>(
  ({ numPeople = 0, size, className, avatarUrls }, _ref) => {
    return (
      <div
        className={cn("z-10 flex -space-x-3 rtl:space-x-reverse", className)}
      >
        {avatarUrls.map((url, index) => (
          <img
            key={index}
            className={cn(
              variants({ size }),
              "rounded-full border-2 border-white dark:border-gray-800"
            )}
            src={url}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
          />
        ))}
        <a
          className={cn(
            variants({ size }),
            "flex items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          )}
        >
          +{numPeople}
        </a>
      </div>
    );
  }
);

export default AvatarCircles;
