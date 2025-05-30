import axios from 'axios';

const GROUP_BASE = 'http://localhost:9090/api/group';

// -----------------------------
// 📁 StudyGroup
// -----------------------------
export const createStudyGroup = (data) =>
    axios.post(`${GROUP_BASE}/study-groups`, data);

export const getStudyGroupById = (id) =>
    axios.get(`${GROUP_BASE}/study-groups/${id}`);

export const getStudyGroupsPaged = (page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-groups/paged`, {
        params: { page, size },
    });

export const updateStudyGroup = (id, group, uEmail) =>
    axios.put(`${GROUP_BASE}/study-groups/${id}`, group, {
        params: { uEmail  },
    });

export const deleteStudyGroup = (id, userId) =>
    axios.delete(`${GROUP_BASE}/study-groups/${id}`, {
        params: { userId },
    });

export const closeStudyGroup = (id) =>
    axios.put(`${GROUP_BASE}/study-groups/${id}/close`);

export const getManagedGroups = (uEmail, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-groups/managed`, {
        params: { uEmail, page, size },
    });

export const getJoinedGroups = (uEmail, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-groups/joined`, {
        params: { uEmail, page, size },
    });

// 📁 StudyGroup 목록 전체 조회 (페이징)
export const getAllStudyGroupsPaged = (page = 0, size = 100) =>
    axios.get(`${GROUP_BASE}/study-groups/paged`, {
        params: { page, size }
    });

// -----------------------------
// 📁 StudyDetail
// -----------------------------
export const getStudyDetail = (studyId) =>
    axios.get(`${GROUP_BASE}/study-details/${studyId}`);

// 📁 StudyDetail 수정 (tools)
export const updateStudyDetail = (studyId, formData) =>
    axios.put(`${GROUP_BASE}/study-details/${studyId}/tools`, formData.tools, {
        params: { requesterEmail: formData.requesterEmail },
    });

export const updateStudyDetailAll = (studyId, formData) =>
    axios.put(`${GROUP_BASE}/study-details/${studyId}`, formData);


// -----------------------------
// 📁 Curriculum
// -----------------------------
export const getCurriculumsByStudy = (studyId, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/curriculums/study/${studyId}`, {
        params: { page, size },
    });

// 📁 Curriculum 수정
export const updateCurriculums = (studyId, curriculumList, requesterEmail) =>
    axios.put(`${GROUP_BASE}/curriculums/study/${studyId}`, curriculumList, {
        params: { requesterEmail },
    });

// -----------------------------
// 📁 StudyMember
// -----------------------------
export const applyToStudy = (studyId, userEmail, userName) =>
    axios.post(`${GROUP_BASE}/study-members`, null, {
        params: { studyId, userEmail, userName },
    });

export const getStudyMembersByStudy = (studyId, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-members/by-study`, {
        params: { studyId, page, size },
    });

export const updateStudyMemberStatus = (id, status) =>
    axios.put(`${GROUP_BASE}/study-members/${id}`, { status });

export const kickMember = (memberId, requesterId) =>
    axios.delete(`${GROUP_BASE}/study-members/${memberId}/kick`, {
        params: { requesterId },
    });

export const acceptMember = (id, requesterEmail) =>
    axios.put(`${GROUP_BASE}/study-members/${id}/accept`, null, {
        params: { requesterEmail },
    });

export const rejectMember = (id, requesterEmail) =>
    axios.put(`${GROUP_BASE}/study-members/${id}/reject`, null, {
        params: { requesterEmail },
    });

export const leaveStudyGroup = (memberId, userId) =>
    axios.delete(`${GROUP_BASE}/study-members/${memberId}/leave`, {
        params: { userId },
    });

// ✅ 수락된 멤버만 조회
export const getAcceptedMembers = (studyId, page = 0, size = 50) =>
    axios.get(`${GROUP_BASE}/study-members/${studyId}/accepted-members`, {
        params: { page, size },
    });


export const getApplicantsByStudy = (studyId, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-members/${studyId}/applicants`, {
        params: { page, size },
    });

// -----------------------------
// 📁 Todo
// -----------------------------
export const getAllTodos = () =>
    axios.get(`${GROUP_BASE}/todos`);

export const createTodo = (todoDto) =>
    axios.post(`${GROUP_BASE}/todos`, todoDto);

export const updateTodo = (id, todoDto) =>
    axios.put(`${GROUP_BASE}/todos/${id}`, todoDto);

export const deleteTodo = (id) =>
    axios.delete(`${GROUP_BASE}/todos/${id}`);

// -----------------------------
// 📁 Admin - StudyGroup
// -----------------------------
export const adminDeleteStudyGroup = (id) =>
    axios.delete(`${GROUP_BASE}/admin/study-groups/${id}`);

// ✅ 관리자 전용 스터디 목록 조회 (페이징)
export const getAllAdminStudyGroupsPaged = (page = 0, size = 100) =>
    axios.get(`${GROUP_BASE}/admin/study-groups/paged`, {
        params: { page, size },
    });
