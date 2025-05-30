package com.example.studygroupservice.service;

import com.example.studygroupservice.dto.StudyGroupSummary;
import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.repository.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudyGroupAdminService {

    private final StudyGroupRepository studyGroupRepository;

    public void delete(Long id) {
        studyGroupRepository.deleteById(id);
    }

    public Page<StudyGroupSummary> getAllStudyGroupsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return studyGroupRepository.findAll(pageable).map(this::toSummary);
    }

    private StudyGroupSummary toSummary(StudyGroup group) {
        var detail = group.getDetail();
        return StudyGroupSummary.builder()
                .id(group.getId())
                .title(group.getTitle())
                .uName(group.getUName() != null ? group.getUName() : "알 수 없음")
                .uEmail(group.getUEmail())
                .description(group.getDescription())
                .category(detail != null ? detail.getCategory() : null)
                .location(detail != null ? detail.getLocation() : null)
                .currentMember(group.getCurrentMember())
                .maxMember(group.getMaxMember())
                .startDate(detail != null ? detail.getStartDate() : null)
                .endDate(detail != null ? detail.getEndDate() : null)
                .meetingDay(detail != null ? detail.getMeetingDay() : null)
                .meetingTime(detail != null ? detail.getMeetingTime() : null)
                .status(group.getStatus())
                .build();
    }
}
