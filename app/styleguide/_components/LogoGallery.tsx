import { Logo } from "@/components/ui/Logo";

/**
 * All three named variants. The mark is auto-traced and still owes a redraw,
 * which is stated here so nobody treats it as final.
 */

function Label({ children }: { readonly children: React.ReactNode }) {
  return (
    <p className="mb-3 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
      {children}
    </p>
  );
}

export function LogoGallery() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Label>Full — the supplied artwork, strapline included</Label>
        <Logo shape="full" className="h-20 w-auto" />
        <p className="mt-2 font-body text-[14px] text-ink">
          Needs roughly 60px of height before the strapline is legible, so it is not used in the
          header.
        </p>
      </div>

      <div>
        <Label>Horizontal — the same lockup without the strapline</Label>
        <Logo className="h-12 w-auto" />
      </div>

      <div>
        <Label>Monogram — the skyline mark alone, cropped to its own bounds</Label>
        <Logo shape="monogram" className="h-16 w-auto" />
      </div>

      <div>
        <Label>Dark — the navy half inverts to ivory via currentColor</Label>
        <div className="bg-navy p-8">
          <Logo tone="dark" className="h-12 w-auto" />
        </div>
      </div>

      <div>
        <Label>Dark monogram</Label>
        <div className="bg-navy p-8">
          <Logo shape="monogram" tone="dark" className="h-16 w-auto" />
        </div>
      </div>
    </div>
  );
}
