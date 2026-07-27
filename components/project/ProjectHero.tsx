import Image from "next/image";
import { BreadcrumbSlab } from "@/components/layout/BreadcrumbSlab";
import { Container } from "@/components/layout/Container";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ResolvedImage } from "@/lib/project-media";
import type { ProjectStatus } from "@/lib/schema";
import { splitProjectTitle } from "./splitProjectTitle";

/**
 * The detail page's opening band: the real hero image under a navy scrim at
 * 62%, with the status badge, the two-tone h1 and the location overlaid.
 *
 * The breadcrumb is the same offset stone slab every other page uses rather
 * than a line of text above the title. The slab is the site's established
 * breadcrumb, and making the project page the one exception would cost the
 * consistency the pattern exists to buy.
 */

type ProjectHeroProps = {
  readonly title: string;
  readonly status: ProjectStatus;
  readonly city: string;
  readonly state: string;
  readonly image: ResolvedImage;
};

export function ProjectHero({ title, status, city, state, image }: ProjectHeroProps) {
  const { lede, rest } = splitProjectTitle(title);

  return (
    <div>
      <div className="relative flex h-80 items-center xl:h-[380px]">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* 62% is what carries ivory body copy over an unknown photograph. */}
        <div aria-hidden="true" className="absolute inset-0 bg-navy/62" />

        <Container className="relative">
          <StatusBadge status={status} />
          <SplitHeading as="h1" lede={lede} rest={rest} variant="dark" className="mt-4" />
          <p className="mt-3 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-ivory">
            {city}, {state}
          </p>
        </Container>
      </div>

      <BreadcrumbSlab
        items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: title }]}
      />
    </div>
  );
}
