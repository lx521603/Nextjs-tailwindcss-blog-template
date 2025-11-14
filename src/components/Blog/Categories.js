// src/components/Blog/Categories.js
import { slug } from "github-slugger";
import React from "react";
import Category from "./Category";
import pinyin from 'pinyin';

const getSlug = (tag) => {
  return pinyin(tag, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false,
    segment: false
  }).join('').toLowerCase();
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