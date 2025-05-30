import React, { useEffect, useState } from 'react';
import '../../style/board/BoardCategory.css';
import { fetchCategoryList } from '../../api/boardApi'; // ✅ boardApi에서 불러오기

function BoardCategory({ onBoardSelect }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  useEffect(() => {
    fetchCategoryList()
        .then(response => setBoards(response.data))
        .catch(error => console.error('보드 목록 불러오기 실패:', error));
  }, []);

  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
    onBoardSelect(boardId);
  };

  return (
      <div className="board-category">
        <ul className="board-list">
          <li
              key="all"
              onClick={() => handleBoardClick(null)}
              className={`board-item ${selectedBoardId === null ? 'selected' : ''}`}
          >
            전체
          </li>
          {boards.map(board => (
              <li
                  key={board.bId}
                  onClick={() => handleBoardClick(board.bId)}
                  className={`board-item ${selectedBoardId === board.bId ? 'selected' : ''}`}
              >
                {board.category}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default BoardCategory;
