import React from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
  return (
    <section className={`py-section max-w-7xl mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
}
