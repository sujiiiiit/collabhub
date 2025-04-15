import MultiAvatar from "@/components/ui/multiAvatar";

import React from "react";
import RoleDetail from "@/pages/components/roleDetail";

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

const ForYou: React.FC = () => {
  return (
    <div className="flex md:flex-row flex-col gap-3 ">
      {/* post cards  */}
      <div className="w-full md:max-w-sm *:mt-2 ">
        <div
          data-state="active"
          className="group cursor-pointer relative w-full flex flex-col gap-1 p-3 border-b rounded-lg data-[state=active]:border"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex justify-start items-center gap-2">
            <div className='w-6 h-6 rounded-full border bg-muted bg-[url("https://github.com/sujiiiiit.png")] bg-cover bg-no-repeat'></div>
            <a href="#" className="text-sm text-black/80">
              Sujit Dwivedi
            </a>
          </div>
          <div className="w-full font-medium text-black text-lg">
            Web developer
          </div>
          <div className="text-xs text-black/80">Remote</div>
          <MultiAvatar
            size={"sm"}
            numPeople={99}
            avatarUrls={avatarUrls}
            className="my-2"
          />

          <div className="flex flex-nowrap justify-between items-center">
            <div className="text-xs text-black/80">₹2L - ₹10L</div>
            <div className="text-xs text-black/80">24h</div>
          </div>
          <button className="absolute right-1 top-1 p-2 rouneded-full bg-transparent hover:bg-muted rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
            </svg>
          </button>
        </div>
      </div>
      <RoleDetail id={"67188b38f89cb120baaa892d"} />
    </div>
  );
};

export default ForYou;
