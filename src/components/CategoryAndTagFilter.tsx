// src/components/CategoryAndTagFilter.tsx
import React from 'react';
import { EventCategory } from '../enums/EventCategory';
import { EventTag } from '../enums/EventTag'; // You'll need to create this file

interface FilterProps {
  selectedCategory: string | null;
  selectedTags: string[];
  onCategoryChange: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
}

const CategoryAndTagFilter: React.FC<FilterProps> = ({ 
  selectedCategory, 
  selectedTags,
  onCategoryChange,
  onTagToggle
}) => {
  return (
    <div className="filter-container space-y-6 p-4 bg-gray-50 rounded-lg">
      {/* Category filter */}
      <div>
        <h3 className="text-lg font-medium mb-2">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => onCategoryChange(null)}
          >
            All Categories
          </button>
          
          {Object.values(EventCategory).map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tags filter */}
      <div>
        <h3 className="text-lg font-medium mb-2">Filter by Tags</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(EventTag).map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button
            className="text-sm text-blue-600 mt-2 hover:underline"
            onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
          >
            Clear all tags
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryAndTagFilter;