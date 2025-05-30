import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoardCategory from "../../components/board/BoardCategory";
import PostList from "../../components/board/PostList";
import TagSelector from "../../components/board/TagSelector";
import SearchBar from "../../components/board/SearchBar.jsx";
import '../../style/board/BoardPage.css';


function BoardPage() {
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.tag) {
            setSelectedTags(location.state.tag);
        }
    }, [location.state]);

    const handleTagsSelect = (tags) => {
        setSelectedTags(tags);
    };

    return (
        <div>
            <div className="banner">
                <h1>게시판에 오신 것을 환영합니다!</h1>
                <p>다양한 주제의 게시물을 찾아보세요.</p>
            </div>
            <div className="board-page-layout">

                <div className="board-sidebar-left">
                    <BoardCategory onBoardSelect={setSelectedBoardId} />
                </div>

                <div className="board-main">
                    <div className="board-main-header">
                        <SearchBar></SearchBar>
                        <div className="board-main-header-content">
                            <h2>게시판</h2>
                            <button onClick={() => navigate("/posts/create")}>
                                글쓰기
                            </button>
                        </div>
                    </div>
                    <PostList boardId={selectedBoardId || null} tags={selectedTags} />
                </div>

                <div className="board-sidebar-right">
                    <h3>태그</h3>
                    <TagSelector onTagsSelect={handleTagsSelect} />
                </div>
            </div>
        </div>
    );
}

export default BoardPage;
