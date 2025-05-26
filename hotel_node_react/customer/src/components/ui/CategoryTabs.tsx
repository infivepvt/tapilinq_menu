import React, { useEffect, useRef, useState } from "react";
import { Category } from "../../types";
import { UPLOADS_URL } from "../../api/urls";

const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: any) => {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stickyThreshold = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        if (!stickyThreshold.current) {
          stickyThreshold.current = tabsRef.current.offsetTop;
        }
        setIsSticky(window.scrollY > stickyThreshold.current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (categoryName: string, index: number) => {
    onCategoryChange(categoryName);

    if (scrollContainerRef.current) {
      const button = scrollContainerRef.current.children[index] as HTMLElement;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const buttonWidth = button.offsetWidth;
      const buttonOffsetLeft = button.offsetLeft;

      // Calculate the scroll position to center the button
      const scrollPosition =
        buttonOffsetLeft - (containerWidth - buttonWidth) / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={tabsRef}
      className={`bg-white dark:bg-gray-900 py-4 transition-all duration-300 ${
        isSticky ? "sticky top-16 z-30 shadow-md animate-slideDown" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar space-x-2 pb-2"
        >
          {categories.map((category: any, index: number) => (
            <button
              key={category.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryClick(category.name, index)}
            >
              <img
                src={
                  category.image?.startsWith("https")
                    ? category.image
                    : category.image
                    ? `${UPLOADS_URL}${category.image}`
                    : ``
                }
                alt={category.name}
                className="w-5 h-5 object-cover rounded-full shrink-0"
              />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
