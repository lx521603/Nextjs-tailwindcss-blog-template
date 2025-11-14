import { defineConfig, s } from 'velite'
import GithubSlugger from 'github-slugger'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import pinyin from 'pinyin'  // ← 新增：中文转拼音

const slugger = new GithubSlugger()

const codeOptions = {
  theme: 'github-dark',
  grid: false,
}

// ---------- Blog Schema ----------
const blog = s
  .object({
    title: s.string(),
    publishedAt: s.isodate(),
    updatedAt: s.isodate(),
    description: s.string(),
    image: s.image(),
    isPublished: s.boolean().default(true),
    author: s.string(),
    tags: s.array(s.string()),  // 中文标签
    body: s.mdx(),
    toc: s.toc(),
    slug: s.string(),
  })
  .transform(data => {
    slugger.reset()

    // ← 新增：tags 转拼音 slug（英文，便于 URL）
    const tagSlugs = data.tags.map(tag => 
      pinyin(tag, { 
        style: pinyin.STYLE_NORMAL,  // 无调号，如 "qianduan"
      }).join('-')  // 多字连字符
    )

    return {
      ...data,
      url: `/blogs/${data.slug}`,
      readingTime: readingTime(data.body),
      tagSlugs,  // 现在是英文拼音，如 ["qianduan", "next-js"]
      image: {
        ...data.image,
        src: data.image.src.replace('/static', '/blogs'),
      },
    }
  })

// ---------- Velite Config ----------
export default defineConfig({
  root: 'content',
  collections: {
    blogs: {
      name: 'Blog',
      pattern: 'blogs/**/*.mdx',
      schema: blog,
    },
  },
  output: {
    data: '.velite/generated',
    assets: 'public/blogs',
    clean: true,
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      [rehypePrettyCode, codeOptions],
    ],
  },
})