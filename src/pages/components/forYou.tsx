// import MultiAvatar from "@/components/ui/multiAvatar";
import React, { useEffect, useState } from "react";

import RoleDetail from "@/pages/components/roleDetail";

// const avatarUrls = [
//   "https://avatars.githubusercontent.com/u/16860528",
//   "https://avatars.githubusercontent.com/u/20110627",
//   "https://avatars.githubusercontent.com/u/106103625",
//   "https://avatars.githubusercontent.com/u/59228569",
// ];

import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

function getTimeSince(targetDate: string): string {
  const parsedTargetDate = new Date(targetDate);
  const currentDate = new Date();

  // Ensure the target date is in the past
  if (parsedTargetDate >= currentDate) {
    return "The date is in the future";
  }

  const yearsDiff = differenceInYears(currentDate, parsedTargetDate);
  if (yearsDiff > 0) {
    return `${yearsDiff} yr${yearsDiff > 1 ? "s" : ""} `;
  }

  const monthsDiff = differenceInMonths(currentDate, parsedTargetDate);
  if (monthsDiff > 0) {
    return `${monthsDiff} mo${monthsDiff > 1 ? "s" : ""} `;
  }

  const daysDiff = differenceInDays(currentDate, parsedTargetDate);
  if (daysDiff > 0) {
    return `${daysDiff} d${daysDiff > 1 ? "s" : ""} `;
  }

  const hoursDiff = differenceInHours(currentDate, parsedTargetDate);
  if (hoursDiff > 0) {
    return `${hoursDiff} h${hoursDiff > 1 ? "s" : ""} `;
  }

  const minutesDiff = differenceInMinutes(currentDate, parsedTargetDate);
  if (minutesDiff > 0) {
    return `${minutesDiff} m${minutesDiff > 1 ? "s" : ""} `;
  }

  return "Just now"; // If the target date is very close to the current date
}

const ForYou: React.FC = () => {
  interface Post {
    id: string;
    userId: string;
    roles: string[];
    address: string;
    createdAt: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);
  // Fetch posts data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rolepost/");
        const data = await response.json();
        setPosts(data);

        // Set initial post ID to the first one by default
        if (data.length > 0) {
          setSelectedPostId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Fetch username based on userId
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const uniqueUserIds = [...new Set(posts.map((post) => post.userId))];
        const fetchedUsernames: { [key: string]: string } = {};

        // Fetch each userId's username and store in state
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            const response = await fetch(
              `http://localhost:5000/api/users/${userId}`
            );
            const data = await response.json();
            fetchedUsernames[userId] = data.username;
          })
        );

        setUsernames(fetchedUsernames);
      } catch (error) {
        console.error("Failed to fetch usernames:", error);
      }
    };

    if (posts.length > 0) {
      fetchUsernames();
    }
  }, [posts]);

  // Handle post card click
  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleRoleDetailClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";

  };

  return (
    <div className="flex md:flex-row flex-col gap-4 items-start">
      {/* Post cards */}
      <div className="w-full md:max-w-sm *:mt-2">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            className="group cursor-pointer relative w-full flex flex-col gap-1 p-3 border-b "
            style={{ borderRadius: "8px" }}
          >
            <div className="flex justify-start items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full border bg-muted bg-cover bg-no-repeat`}
                style={{
                  backgroundImage: `url(https://github.com/${
                    usernames[post.userId]
                  }.png)`,
                }}
              ></div>
              <a href="#" className="text-sm text-black/80">
                {usernames[post.userId] || "Loading..."}
              </a>
            </div>
            <div className="w-full font-medium text-black text-lg">
              {post.roles.join(", ")}
            </div>
            <div className="text-xs text-black/80 truncate max-w-44">
              {post.address}
            </div>
            {/* <MultiAvatar
              size={"sm"}
              numPeople={99}
              avatarUrls={avatarUrls}
              className="my-2"
            /> */}
            <div className="flex flex-nowrap justify-between items-center">
              <div className="text-xs text-black/80">₹2L - ₹10L</div>
              <div className="text-xs text-black/80">
                {getTimeSince(post.createdAt)}
              </div>
            </div>
            {/* <button className="absolute right-1 top-1 p-2 rouneded-full bg-transparent hover:bg-muted ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
              </svg>
            </button> */}
          </div>
        ))}
      </div>
      <div
        id="roleDetail"
        className={`md:sticky md:h-[calc(100vh_- _4px )] md:top-2  bg-white  top-16 left-0 bottom-0 right-0 fixed md:w-full w-dvw transition-all md:translate-x-0 ${
          isOpen ?"translate-x-0": "translate-x-full"
        } `}
      >
        <div className="border-b md:hidden">
          <button onClick={handleRoleDetailClose} className="font-extralight text-lg px-4 h-12 flex justify-start w-full items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M162.83,205.17a4,4,0,0,1-5.66,5.66l-80-80a4,4,0,0,1,0-5.66l80-80a4,4,0,1,1,5.66,5.66L85.66,128Z"></path>
            </svg>
            Back to Search
          </button>
        </div>
        {/* Render RoleDetail component for the selected post */}
        {selectedPostId && <RoleDetail id={selectedPostId} />}
      </div>
    </div>
  );
};

export default ForYou;
