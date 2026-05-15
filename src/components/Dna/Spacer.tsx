type SpacerSize = "16" | "24" | "32" | "48";

const sizes: Record<SpacerSize, string> = {
  "16": "h-16",
  "24": "h-24",
  "32": "h-32",
  "48": "h-48",
};

type SpacerProps = {
  size?: SpacerSize;
};

export function Spacer({ size = "24" }: SpacerProps) {
  return <div className={sizes[size]} />;
}
