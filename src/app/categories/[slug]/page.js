// app/categories/[slug]/page.tsx
import { blogs as allBlogs } from "@/.velite/generated";
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import pinyin from "pinyin";

// 工具函数：中文标签 → 拼音 slug（和 velite.config 保持一致）
const getTagSlug = (tag: string): string => {
  return pinyin(tag, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false,
  })
    .join("-")
    .toLowerCase();
};

// 预生成所有分类页（"all" + 每个 tag 的拼音 slug）
export async function generateStaticParams() {
  const paths = [{ slug: "all" }];
  const seen = new Set<string>();

  allBlogs.forEach((blog) => {
    if (blog.isPublished) {
      blog.tagSlugs.forEach((slug) => {
        if (!seen.has(slug)) {
          seen.add(slug);
          paths.push({ slug });
        }
      });
    }
  });

  return paths;
}

// SEO 元数据：显示中文标签名
export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (params.slug === "all") {
    return {
      title: "All Blogs",
      description: "Explore all our expert blogs and tutorials",
    };
  }

  // 找第一个包含此 slug 的博客，获取原始中文 tag
  const blogWithTag = allBlogs.find(
    (blog) => blog.tagSlugs.includes(params.slug) && blog.isPublished
  );

  const originalTag = blogWithTag
    ? blogWithTag.tags[blogWithTag.tagSlugs.indexOf(params.slug)]
    : params.slug;

  return {
    title: `${originalTag} Blogs`,
    description: `Learn more about ${originalTag} through our collection of expert blogs`,
  };
}

// 主组件
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const currentSlug = params.slug;

  // 生成所有分类（用于 <Categories /> 组件）
  const allCategories = ["all"];
  allBlogs.forEach((blog) => {
    blog.tagSlugs.forEach((slug) => {
      if (!allCategories.includes(slug)) {
        allCategories.push(slug);
      }
    });
  });
  allCategories.sort();

  // 过滤当前分类的博客
  const blogs = allBlogs.filter((blog) => {
    if (currentSlug === "all") return blog.isPublished;
    return blog.tagSlugs.includes(currentSlug) && blog.isPublished;
  });

  // 获取当前分类的中文名称（用于 #标题）
  const currentTagName =
    currentSlug === "all"
      ? "all"
      : allBlogs
          .find((blog) => blog.tagSlugs.includes(currentSlug))
          ?.tags[
            allBlogs.find((blog) => blog.tagSlugs.includes(currentSlug))!
              .tagSlugs.indexOf(currentSlug)
          ] || currentSlug;

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl">
          #{currentTagName}
        </h1>
        <span className="mt-2 inline-block">
          Discover more categories and expand your knowledge!
        </span>
      </div>

      {/* 分类导航 */}
      <Categories categories={allCategories} currentSlug={currentSlug} />

      {/* 博客网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
        {blogs.map((blog, index) => (
          <article
            key={blog._id || index}
            className="col-span-1 row-span-1 relative"
          >
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
    </article>
  );
}