// src/components/Blog/Categories.tsx
import { slug } from "github-slugger";  // ← 保留
import React from "react";
import Category from "./Category";
import pinyin from 'pinyin'  // ← 新增
import { blogs as allBlogs } from "@/.velite/generated"  // ← 新增

// 新增：中文 → 拼音 slug
const getSlug = (tag: string) => {
  return pinyin(tag, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false,
  }).join('-').toLowerCase()
}

const Categories = ({ categories, currentSlug }) => {
  return (
    <div className="px-0 md:px-10 sxl:px-20 mt-10 border-t-2 text-dark dark:text-light border-b-2 border-solid border-dark dark:border-light py-4 flex items-start flex-wrap font-medium mx-5 md:mx-10">
      {categories.map((cat) => {
        // 关键：用拼音 slug 生成链接和比较
        const slugified = getSlug(cat)
        return (
          <Category
            key={cat}
            link={`/categories/${slugified}`}  // ← 拼音 URL
            name={cat}                         // ← 显示中文
            active={currentSlug === slugified} // ← 拼音匹配
          />
        )
      })}
    </div>
  );
};

export default Categories;