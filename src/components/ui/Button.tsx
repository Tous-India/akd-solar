import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "dark" | "light" | "outline-light";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-sun text-ink hover:bg-gold shadow-[0_8px_24px_-10px_rgb(247_147_30/0.7)]",
  secondary: "border border-ink/15 bg-white/70 text-ink hover:border-ink/40 hover:bg-white",
  dark: "bg-navy text-cream hover:bg-panel",
  light: "bg-cream text-ink hover:bg-white",
  "outline-light": "border border-white/25 text-cream hover:border-white/60 hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-5 text-[0.95rem]",
  lg: "min-h-12 px-6 text-base sm:min-h-14 sm:px-7",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: IconName | null;
  iconLeft?: IconName;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", icon = "arrowRight", iconLeft, magnetic, className = "", children } = props;
  const classes = `group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {iconLeft ? <Icon name={iconLeft} className="size-5 shrink-0" /> : null}
      <span>{children}</span>
      {icon ? (
        <Icon name={icon} className="size-[1.1rem] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      ) : null}
    </>
  );
  const magneticAttr = magnetic ? { "data-magnetic": "" } : {};

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, external, variant: _v, size: _s, icon: _i, iconLeft: _il, magnetic: _m, className: _c, children: _ch, ...rest } = props;
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...magneticAttr}
          {...rest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...magneticAttr} {...rest}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, icon: _i, iconLeft: _il, magnetic: _m, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button type="button" className={classes} {...magneticAttr} {...rest}>
      {content}
    </button>
  );
}
