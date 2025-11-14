// velite.config.js
import { defineConfig, s } from 'velite'
import GithubSlugger from 'github-slugger'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { pinyin } from 'pinyin-pro'   // ✅ 改用 pinyin-pro

const slugger = new GithubSlugger()

const codeOptions = {
  theme: 'github-dark',
  grid: false,
}

const blog = s
  .object({
    title: s.string(),
    publishedAt: s.isodate(),
    updatedAt: s.isodate(),
    description: s.string(),
    image: s.image(),
    isPublished: s.boolean().default(true),
    author: s.string(),
    tags: s.array(s.string()),
    body: s.mdx(),
    toc: s.toc(),
    slug: s.string(),
  })
  .transform(data => {
    slugger.reset()

    // ✅ 中文标签转拼音 slug
    const tagSlugs = data.tags.map(tag => {
      if (/[\u4e00-\u9fa5]/.test(tag)) {
        return pinyin(tag, { toneType: 'none', type: 'array' }).join('-').toLowerCase()
      }
      return slugger.slug(tag)
    })

    // ✅ 标题 slug 也支持中文
    const titleSlug = /[\u4e00-\u9fa5]/.test(data.title)
      ? pinyin(data.title, { toneType: 'none', type: 'array' }).join('-').toLowerCase()
      : slugger.slug(data.title)

    return {
      ...data,
      slug: titleSlug,
      url: `/blogs/${titleSlug}`,
      readingTime: readingTime(data.body),
      tagSlugs,
      image: {
        ...data.image,
        src: data.image.src.replace('/static', '/blogs'),
      },
    }
  })

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
