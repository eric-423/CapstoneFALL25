import { cn } from "@/utils/lib/utils";

import { ReactNode } from "react";

type StyledHeadingProps = {
  text: string | ReactNode;
  lineColor?: string;
  className?: string;
};

const StyledHeading = ({ text, className, lineColor }: StyledHeadingProps) => {
  return (
    <>
      <span className={cn("relative inline-block", className)}>
        {text}
        <svg
          className="absolute -bottom-3 left-0 w-full h-6 pt-0 pointer-events-none"
          viewBox="0 -5 200 12"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 7 Q100 -4 200 7"
            stroke={lineColor || "#F8A91F"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  );
};

export default StyledHeading;
