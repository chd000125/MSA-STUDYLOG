package com.example.studygroupservice.service;

import com.example.studygroupservice.dto.StudyCreateRequest;
import com.example.studygroupservice.dto.StudyDetailUpdateRequest;
import com.example.studygroupservice.entity.StudyDetail;
import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.repository.StudyDetailRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyDetailService {

    private final StudyDetailRepository studyDetailRepository;

    public void createDetail(StudyCreateRequest request, StudyGroup group) {
        StudyDetail detail = StudyDetail.builder()
                .studyGroup(group)
                .category(request.getCategory())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .meetingType(request.getMeetingType())
                .meetingTime(request.getMeetingTime())
                .meetingDay(request.getMeetingDay())
                .requirements(request.getRequirements())
                .tools(request.getTools())
                .tags(request.getTags())
                .build();

        studyDetailRepository.save(detail);
    }

    public StudyDetail getDetailByStudyId(Long studyId) {
        return studyDetailRepository.findByStudyGroupId(studyId);
    }

    public void updateTools(Long studyId, List<String> tools, String requesterEmail) {
        StudyDetail detail = studyDetailRepository.findByStudyGroupId(studyId);

        if (!detail.getStudyGroup().getUEmail().equals(requesterEmail)) {
            throw new RuntimeException("작성자만 수정할 수 없습니다.");
        }

        detail.setTools(tools);
        studyDetailRepository.save(detail);
    }


    @Transactional
    public void updateDetail(Long studyId, StudyDetailUpdateRequest dto) {
        StudyDetail detail = studyDetailRepository.findByStudyGroupId(studyId);

        if (!detail.getStudyGroup().getUEmail().equals(dto.getRequesterEmail())) {
            throw new RuntimeException("작성자만 수정할 수 있습니다.");
        }

        detail.setCategory(dto.getCategory());
        detail.setLocation(dto.getLocation());
        detail.setStartDate(dto.getStartDate());
        detail.setEndDate(dto.getEndDate());
        detail.setMeetingType(dto.getMeetingType());
        detail.setMeetingTime(dto.getMeetingTime());
        detail.setTools(dto.getTools());
        detail.setMeetingDay(dto.getMeetingDay());

        studyDetailRepository.save(detail);
    }


}
