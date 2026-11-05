import type { ElementType, ReactNode } from "react";

type Props = { as?: ElementType; className?: string; children: ReactNode; id?: string };

export function Container({ as: Tag = "div", className = "", children, id }: Props) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
