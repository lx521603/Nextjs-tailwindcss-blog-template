import { blogs } from "@/.velite/generated";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPosts from "../components/Home/FeaturedPosts";
import RecentPosts from "../components/Home/RecentPosts";

export default function Home() {
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  return (
    <main className="flex flex-col items-center justify-center">
      <HomeCoverSection blogs={safeBlogs} />
      <FeaturedPosts blogs={safeBlogs} />
      <RecentPosts blogs={safeBlogs} />
    </main>
  );
}
