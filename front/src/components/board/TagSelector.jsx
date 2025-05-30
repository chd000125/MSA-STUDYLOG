import React, { useEffect, useState } from 'react';
import '../../style/board/TagSelector.css';
import { fetchTags } from '../../api/boardApi'; // ✅ axios 대체

function TagSelector({ onTagsSelect }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchTags()
        .then(response => setTags(response.data))
        .catch(error => console.error('태그 목록 불러오기 실패:', error));
  }, []);

  const handleTagClick = (tagName) => {
    setSelectedTags((prevTags) =>
        prevTags.includes(tagName)
            ? prevTags.filter(tag => tag !== tagName)
            : [...prevTags, tagName]
    );
  };

  useEffect(() => {
    onTagsSelect(selectedTags);
  }, [selectedTags, onTagsSelect]);

  return (
      <div className="tag-selector">
        <div className="tag-container">
          {tags.map(tag => (
              <div
                  key={tag.id}
                  onClick={() => handleTagClick(tag.name)}
                  className={`tag-item ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
              >
                {tag.name}
              </div>
          ))}
        </div>
      </div>
  );
}

export default TagSelector;
