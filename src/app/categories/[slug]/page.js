// app/categories/[slug]/page.js
import { blogs as allBlogs } from "@/.velite/generated";
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import Categories from "@/src/components/Blog/Categories";
import pinyin from "pinyin";  // 默认导入

const getTagSlug = (tag) => {
  return pinyin(tag, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false,
    segment: false  // 禁用分词
  })
    .join("")
    .toLowerCase();
};

// 预生成所有分类页
export async function generateStaticParams() {
  const paths = [{ slug: "all" }];
  const seen = new Set();

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

// SEO 元数据
export async function generateMetadata({ params }) {
  if (params.slug === "all") {
    return {
      title: "All Blogs",
      description: "Explore all our expert blogs and tutorials",
    };
  }

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
export default function CategoryPage({ params }) {
  const currentSlug = params.slug;

  // 生成所有分类
  const allCategories = ["all"];
  allBlogs.forEach((blog) => {
    blog.tagSlugs.forEach((slug) => {
      if (!allCategories.includes(slug)) {
        allCategories.push(slug);
      }
    });
  });
  allCategories.sort();

  // 过滤博客
  const blogs = allBlogs.filter((blog) => {
    if (currentSlug === "all") return blog.isPublished;
    return blog.tagSlugs.includes(currentSlug) && blog.isPublished;
  });

  // 当前标签中文名
  const currentTagName =
    currentSlug === "all"
      ? "all"
      : allBlogs
          .find((blog) => blog.tagSlugs.includes(currentSlug))
          ?.tags[
            allBlogs.find((blog) => blog.tagSlugs.includes(currentSlug))
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

      <Categories categories={allCategories} currentSlug={currentSlug} />

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