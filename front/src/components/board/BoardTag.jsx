import React, { useEffect, useState } from 'react';
import { fetchCategoryList } from '../../api/boardApi'; // ✅ 공통 API 사용
// axios 삭제: import axios from 'axios'; 제거

function BoardTag({ onTagClick }) {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetchCategoryList()
            .then(response => {
                const randomBoards = shuffleArray(response.data).slice(0, 5);
                setBoards(randomBoards);
            })
            .catch(error => console.error('보드 목록 불러오기 실패:', error));
    }, []);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    return (
        <div className="tags">
            {boards.map((board) => (
                <span
                    key={board.id}
                    className="tag"
                    onClick={() => onTagClick(board.id)}
                >
          #{board.name}
        </span>
            ))}
        </div>
    );
}

export default BoardTag;
