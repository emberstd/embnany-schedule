import Image from "next/image";
import type { CelebrityProfile } from "@/types/schedule";

type ScheduleHeaderProps = {
  profile: CelebrityProfile;
};

export function ScheduleHeader({ profile }: ScheduleHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-white shadow-lg">
        <Image
          src={profile.avatarSrc}
          alt={profile.name}
          fill
          className="object-cover"
          style={{ objectPosition: profile.avatarPosition ?? "center" }}
          priority
        />
      </div>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
        {profile.name}
      </h1>
      <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
        {profile.subtitle}
      </p>
    </header>
  );
}
