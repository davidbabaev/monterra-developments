import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * The project's long-form narrative, compiled from the MDX body at build time.
 *
 * There is no typography plugin in this stack, so every element an author can
 * write is mapped to the type scale explicitly. Anything not mapped here falls
 * back to the browser default, which is the signal to add it rather than to
 * write raw HTML in the content.
 *
 * Measure is capped by the caller at 68ch.
 */

type ProjectBodyProps = {
  readonly source: string;
};

const PROSE = "font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]";

const components = {
  p: (props: React.ComponentProps<"p">) => <p className={PROSE} {...props} />,
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-10 font-display text-[19px] font-semibold text-navy first:mt-0 xl:text-[22px]"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-8 font-display text-[19px] font-semibold text-navy first:mt-0" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className={`list-disc pl-5 ${PROSE}`} {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className={`list-decimal pl-5 ${PROSE}`} {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="mt-2" {...props} />,
  strong: (props: React.ComponentProps<"strong">) => <strong className="font-medium" {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="border-b border-bronze text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
      {...props}
    />
  ),
};

export function ProjectBody({ source }: ProjectBodyProps) {
  return (
    <div className="flex flex-col gap-5">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
