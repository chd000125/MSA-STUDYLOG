// src/components/MyPostsSection.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPostsByAuthor } from '../../api/boardApi'; // ✅ boardApi 사용
import "../../style/board/MyPostsSection.css"

const MyPostsSection = ({ email }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const res = await fetchPostsByAuthor(email, page, 5); // ✅ 기존 axios 대체
                setPosts(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error('📛 내 게시글 불러오기 실패:', error);
            }
        };

        if (email) fetchMyPosts();
    }, [email, page]);

    const handleEdit = (postId) => {
        navigate(`/post/edit/${postId}`);
    };

    return (
        <div className="my-posts-section">
            <h3>내가 작성한 게시글</h3>
            {posts.length === 0 ? (
                <p>작성한 게시글이 없습니다.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} style={{ marginBottom: '10px' }}>
                            <div>
                                <strong>{post.title}</strong> - 조회수: {post.viewCount} -{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                                <button
                                    onClick={() => handleEdit(post.id)}
                                    style={{ marginTop: '5px' }}
                                >
                                    수정
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            )}

            <div className="pagination" style={{ marginTop: '20px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)} disabled={i === page}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MyPostsSection;
