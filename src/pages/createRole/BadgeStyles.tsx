// src/components/BadgeStyles.tsx

const badgeStyles = [
    { background: "bg-red-500/20", border: "border-red-700" },
    { background: "bg-green-500/20", border: "border-green-700" },
    { background: "bg-blue-500/20", border: "border-blue-700" },
    { background: "bg-yellow-500/20", border: "border-yellow-700" },
    { background: "bg-purple-500/20", border: "border-purple-700" },
  ];
  
  export function getRandomBadgeStyle() {
    const randomIndex = Math.floor(Math.random() * badgeStyles.length);
    return badgeStyles[randomIndex];
  }