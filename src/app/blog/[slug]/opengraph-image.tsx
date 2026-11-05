import { renderOg } from "@/lib/og";
import { getPost, posts } from "@/lib/blog";

export const alt = "AKD Solar blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOg({ title: post?.title ?? "AKD Solar blog", eyebrow: post?.category ?? "Blog" });
}
