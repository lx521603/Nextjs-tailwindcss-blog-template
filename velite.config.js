// velite.config.js
import { defineConfig, s } from 'velite'
import GithubSlugger from 'github-slugger'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import * as pinyin from 'pinyin'

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

    const tagSlugs = data.tags.map(tag =>
      pinyin.pinyin(tag, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false,
      })
        .join('-')
        .toLowerCase()
    )

    return {
      ...data,
      url: `/blogs/${data.slug}`,
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
      [rehypePrettyCode, codeOptions]  // 正确：逗号，不是冒号
    ],
  },
})