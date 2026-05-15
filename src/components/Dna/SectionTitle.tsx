import React from "react";

type SectionTitleProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionTitle({
  children,
  as: Tag = "h2",
  className = "",
}: SectionTitleProps) {
  return (
    <Tag className={`text-4xl font-semibold tracking-tight text-df-dark mb-6 ${className}`}>
      {children}
    </Tag>
  );
}
