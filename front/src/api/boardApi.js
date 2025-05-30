import axios from 'axios';

const BASE_URL = 'http://localhost:9090/api/boards';
const AUTO_BASE_URL = 'http://localhost:9090/api/autocomplete';

// 📁 [Board] 카테고리
export const fetchCategoryList = () => axios.get(`${BASE_URL}`);
export const fetchCategoryById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createCategory = (category) => axios.post(`${BASE_URL}`, { category });
export const updateCategory = (id, category) => axios.put(`${BASE_URL}/${id}`, { category });
export const deleteCategory = (id) => axios.delete(`${BASE_URL}/${id}`);

// 📁 [Post] 게시글
export const fetchPostsByCategory = (boardId) =>
    axios.get(`${BASE_URL}/posts`, { params: { boardId } });

export const fetchPagedPosts = (page = 0, size = 10) =>
    axios.get(`${BASE_URL}/posts/paged`, { params: { page, size } });

export const fetchPostById = (postId) =>
    axios.get(`${BASE_URL}/posts/${postId}`);

export const fetchPostAndIncreaseView = (postId) =>
    axios.get(`${BASE_URL}/posts/${postId}/view`);

export const fetchPostsByBoardWithTags = (boardId, tags, page = 0, size = 10) =>
    axios.get(`${BASE_URL}/posts/by-board/${boardId}`, {
        params: {
            tags: tags?.join(','),
            page,
            size,
        },
    });

export const fetchPostsByAuthor = (email, page = 0, size = 10) =>
    axios.get(`${BASE_URL}/posts/by-author`, {
        params: { email, page, size },
    });

export const fetchAllPostsByTags = (tags = [], page = 0, size = 10) =>
    axios.get(`${BASE_URL}/posts/all`, {
        params: {
            tags: tags?.join(','),
            page,
            size,
        },
    });

export const createPost = (boardId, postRequestDto) =>
    axios.post(`${BASE_URL}/posts/${boardId}`, postRequestDto);

export const updatePost = (postId, postData) =>
    axios.put(`${BASE_URL}/posts/${postId}`, postData);

export const deletePost = (postId) =>
    axios.delete(`${BASE_URL}/posts/${postId}`);

// 📁 [Comment] 댓글
export const fetchCommentsByPostId = (postId) =>
    axios.get(`${BASE_URL}/comments/${postId}`);

export const createComment = (postId, commentDto) =>
    axios.post(`${BASE_URL}/comments/${postId}`, commentDto);

export const updateComment = (commentId, commentDto) =>
    axios.put(`${BASE_URL}/comments/${commentId}`, commentDto);

export const deleteComment = (commentId) =>
    axios.delete(`${BASE_URL}/comments/${commentId}`);

// 📁 [Tag] 태그
export const fetchTags = () => axios.get(`${BASE_URL}/tags`);
export const createTag = (name) => axios.post(`${BASE_URL}/tags`, { name });
export const updateTag = (id, name) => axios.put(`${BASE_URL}/tags/${id}`, { name });
export const deleteTag = (id) => axios.delete(`${BASE_URL}/tags/${id}`);
export const fetchTagById = (id) => axios.get(`${BASE_URL}/tags/${id}`);

// 📁 [Search] 통합 검색
export const searchBoards = (keyword, page = 0, size = 10) =>
    axios.get(`${BASE_URL}/search`, {
        params: { keyword, page, size },
    });

export const searchPosts = (keyword, page = 0, size = 10) =>
    axios.get(`${BASE_URL}/posts/search`, {
        params: { keyword, page, size },
    });

export const searchComments = (keyword, page = 0, size = 10) =>
    axios.get(`${BASE_URL}/comments/search`, {
        params: { keyword, page, size },
    });

// 📁 [AutoComplete] 제목 자동완성
export const autocompletePostTitle = (prefix) =>
    axios.get(`${AUTO_BASE_URL}/title`, {
        params: { prefix },
    });

export const fetchPostsByExactTitle = (title) =>
    axios.get(`${BASE_URL}/posts/search/title`, {
        params: { title },
    });

