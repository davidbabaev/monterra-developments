import Image from "next/image";
import { LinkedInMark } from "@/components/ui/LinkedInMark";
import type { TeamMember } from "@/lib/team";

/**
 * Four columns from 1280px, two from 768px, one below.
 *
 * Portraits are greyscale and come up to full colour on hover — but only where
 * hovering is possible. The greyscale itself is inside `@media (hover: hover)`,
 * so on a touch screen, where no hover can ever fire, the portraits start and
 * stay in colour rather than being stuck grey forever. That is why it is a media
 * query and not a JavaScript capability check: there is nothing to detect at
 * runtime, and CSS already knows.
 *
 * The role is slate, not bronze. Bronze is forbidden below 26px and this is
 * 13px metadata; at that size it would measure 3.55:1 on ivory and fail.
 *
 * Only the first portrait is `priority`. Four at once cost nothing while these
 * were 4KB placeholders; with real photography it is four 200KB downloads
 * racing each other for bandwidth, and on a phone the grid is a single column
 * below the fold anyway.
 *
 * `object-top`, not the default centre. The portraits are full-length standing
 * shots at 9:16 and the card is 4:5, so cover shows 70% of the frame — centred
 * that takes the same amount off the head as off the feet and crops the face.
 * Pinned to the top it reads as a deliberate head-and-torso card and the shoes
 * are what goes. If a portrait is ever supplied already at 4:5 this class stops
 * mattering rather than starting to fight it.
 */

type TeamGridProps = {
  readonly members: readonly TeamMember[];
};

export function TeamGrid({ members }: TeamGridProps) {
  return (
    <ul aria-label="Team" className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 xl:grid-cols-4">
      {members.map((member, index) => (
        <li key={member.name}>
          <Image
            src={member.photo.src}
            alt={member.photo.alt}
            width={member.photo.width}
            height={member.photo.height}
            priority={index === 0}
            sizes="(min-width: 1280px) 264px, (min-width: 768px) 45vw, 100vw"
            className="aspect-[4/5] w-full object-cover object-top can-hover:grayscale can-hover:hover:grayscale-0 motion-safe:transition-[filter] motion-safe:duration-300"
          />

          <h3 className="mt-4 font-display text-[19px] font-semibold text-navy xl:text-[22px]">
            {member.name}
          </h3>
          <p className="mt-1 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
            {member.role}
          </p>
          <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink">{member.bio}</p>

          {/* Absent linkedin renders nothing at all — no icon, and no gap where
              one would have been, because the element is not there. */}
          {member.linkedin !== undefined && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-flex h-11 w-11 items-center justify-center text-navy hover:text-bronze-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            >
              <LinkedInMark />
              <span className="sr-only">{member.name} on LinkedIn (opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
