// src/components/Blog/Categories.js
import { slug } from "github-slugger";
import React from "react";
import Category from "./Category";
import { pinyin } from "pinyin-pro";  // 改用 pinyin-pro

const getSlug = (tag) => {
  if (/[\u4e00-\u9fa5]/.test(tag)) {
    return pinyin(tag, { toneType: "none", type: "array" })
      .join("-")
      .toLowerCase();
  }
  return tag.toLowerCase().replace(/\s+/g, "-");
};

const Categories = ({ categories, currentSlug }) => {
  return (
    <div className="px-0 md:px-10 sxl:px-20 mt-10 border-t-2 text-dark dark:text-light border-b-2 border-solid border-dark dark:border-light py-4 flex items-start flex-wrap font-medium mx-5 md:mx-10">
      {categories.map((cat) => {
        const slugified = getSlug(cat);
        return (
          <Category
            key={cat}
            link={`/categories/${slugified}`}
            name={cat}
            active={currentSlug === slugified}
          />
        );
      })}
    </div>
  );
};

export default Categories;
