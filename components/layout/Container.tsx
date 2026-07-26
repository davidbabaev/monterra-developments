import { cx } from "@/lib/cx";

/** 1200px measure with the gutter stepping 20 / 40 / 64px. */

type ContainerProps = {
  readonly className?: string;
  readonly children: React.ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cx("mx-auto w-full max-w-[1200px] px-5 md:px-10 xl:px-16", className)}>
      {children}
    </div>
  );
}
