import React, { useEffect, useRef, useState } from "react";
import { UPLOADS_URL } from "../../api/urls";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryName: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stickyThreshold = useRef<number>(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    // Initialize refs array
    buttonRefs.current = buttonRefs.current.slice(0, categories.length - 1);
  }, [categories]);

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

    if (scrollContainerRef.current && index > 0) {
      const buttonIndex = index - 1;
      const button = buttonRefs.current[buttonIndex];
      
      if (button) {
        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const containerCenter = containerRect.left + containerRect.width / 2;
        const buttonCenter = buttonRect.left + buttonRect.width / 2;
        
        const scrollOffset = buttonCenter - containerCenter;
        
        container.scrollBy({
          left: scrollOffset,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <div
      ref={tabsRef}
      className={`bg-white dark:bg-gray-900 py-3 transition-all duration-300 ${
        isSticky ? "sticky top-16 z-30 shadow-md animate-slideDown" : ""
      }`}
    >
      <div className="container mx-auto px-3 flex items-center">
        {categories.length > 0 && (
          <button
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full flex-shrink-0 mt-0 transition-colors sm:px-4 sm:py-2 ${
              activeCategory === categories[0].name
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCategoryClick(categories[0].name, 0)}
            style={{ marginTop: "-8px" }}
          >
            <img
              src={
                categories[0].image?.startsWith("https")
                  ? categories[0].image
                  : categories[0].image
                  ? `${UPLOADS_URL}${categories[0].image}`
                  : ""
              }
              alt={categories[0].name}
              className="w-4 h-4 object-cover rounded-full shrink-0 sm:w-5 sm:h-5"
            />
            <span className="text-sm sm:text-base whitespace-nowrap">
              {categories[0].name}
            </span>
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar space-x-2 pl-2 pb-2 items-center pr-4"
        >
          {categories.slice(1).map((category, index) => (
            <button
              key={category.id}
              ref={(el) => (buttonRefs.current[index] = el)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full flex-shrink-0 transition-colors sm:px-4 sm:py-2 ${
                activeCategory === category.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryClick(category.name, index + 1)}
            >
              <img
                src={
                  category.image?.startsWith("https")
                    ? category.image
                    : category.image
                    ? `${UPLOADS_URL}${category.image}`
                    : ""
                }
                alt={category.name}
                className="w-4 h-4 object-cover rounded-full shrink-0 sm:w-5 sm:h-5"
              />
              <span className="text-sm sm:text-base whitespace-nowrap">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;