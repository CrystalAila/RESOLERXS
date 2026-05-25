import type { FC } from "react";

interface BrandTitleProps {
  as?: "h1" | "p";
  className?: string;
}

const BrandTitle: FC<BrandTitleProps> = ({ as: Tag = "h1", className = "text-2xl font-extrabold tracking-tight text-white" }) => (
  <Tag className={className}>
    RESOLE<span className="text-rx-accent">RXS</span>
  </Tag>
);

export default BrandTitle;
