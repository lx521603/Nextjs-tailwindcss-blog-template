import { defineConfig, s } from 'velite'
import GithubSlugger from 'github-slugger'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { pinyin } from 'pinyin-pro'

const slugger = new GithubSlugger()

const codeOptions = {
  theme: 'github-dark',
  grid: false,
}

const blog = s
  .object({
    title: s.string(),
    publishedAt: s.isodate().optional().default(() => new Date().toISOString()),
    updatedAt: s.isodate().optional().default(() => new Date().toISOString()),
    description: s.string().optional(),
    image: s.image().optional(),
    isPublished: s.boolean().default(true),
    author: s.string().optional(),
    tags: s.array(s.string()).optional().default([]),
    body: s.mdx(),
    toc: s.toc().optional().default([]),
    slug: s.string().optional(),
  })
  .transform(data => {
    slugger.reset()

    const tagSlugs = (data.tags || []).map(tag => {
      if (/[\u4e00-\u9fa5]/.test(tag)) {
        return pinyin(tag, { toneType: 'none', type: 'array' }).join('-').toLowerCase()
      }
      return slugger.slug(tag)
    })

    const titleSlug = /[\u4e00-\u9fa5]/.test(data.title)
      ? pinyin(data.title, { toneType: 'none', type: 'array' }).join('-').toLowerCase()
      : slugger.slug(data.title)

    return {
      ...data,
      slug: data.slug || titleSlug,
      url: `/blogs/${data.slug || titleSlug}`,
      readingTime: readingTime(data.body),
      tagSlugs,
      image: data.image
        ? {
            ...data.image,
            src: data.image.src.replace('/static', '/blogs'),
          }
        : null,
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
