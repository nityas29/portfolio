import Image from "next/image";

const SRC_BY_VARIANT = {
  excited: "/assets/page-friend-excited.png",
  neutral: "/assets/page-friend-neutral.png",
  happy: "/assets/page-friend-happy.png",
  "arms-up": "/assets/page-friend-arms-up.png",
} as const;

type Variant = keyof typeof SRC_BY_VARIANT;

export default function PageFriendCharacter({
  variant,
  size = 120,
}: {
  variant: Variant;
  size?: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={SRC_BY_VARIANT[variant]}
        alt=""
        fill
        sizes={`${size}px`}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
