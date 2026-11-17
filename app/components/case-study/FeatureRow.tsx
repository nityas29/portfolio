import { Body, Heading } from "./Type";

// One feature in a case study's solution walkthrough: a heading + short description
// beside its demo media. Rows alternate sides; non-reversed rows put the text on the
// left, right-aligned toward the media.
export default function FeatureRow({
  title,
  children,
  media,
  reverse = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  media: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}
    >
      <div
        className={`w-full min-w-0 md:flex-[2] flex flex-col gap-3 text-left ${
          reverse ? "" : "md:text-right md:items-end"
        }`}
      >
        <Heading>{title}</Heading>
        <Body>{children}</Body>
      </div>
      {media}
    </div>
  );
}
