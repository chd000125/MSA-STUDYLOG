package com.example.studygroupservice.service;

import com.example.studygroupservice.dto.CurriculumWeekDto;
import com.example.studygroupservice.dto.StudyCreateRequest;
import com.example.studygroupservice.entity.CurriculumWeek;
import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.repository.CurriculumRepository;
import com.example.studygroupservice.repository.StudyGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final StudyGroupRepository studyGroupRepository;

    public void createCurriculum(List<StudyCreateRequest.CurriculumDto> curriculumDtoList, StudyGroup group) {
        List<CurriculumWeek> weeks = curriculumDtoList.stream()
                .map(dto -> CurriculumWeek.builder()
                        .week(dto.getWeek())
                        .title(dto.getTitle())
                        .topics(dto.getTopics())
                        .studyGroup(group)
                        .build())
                .collect(Collectors.toList());

        curriculumRepository.saveAll(weeks);
    }

    public Page<CurriculumWeek> getCurriculumByStudyId(Long studyId, Pageable pageable) {
        return curriculumRepository.findByStudyGroupId(studyId, pageable);
    }

    @Transactional
    public void replaceCurriculums(Long studyId, List<CurriculumWeekDto> dtoList, String requesterEmail) {
        StudyGroup group = studyGroupRepository.findById(studyId)
                .orElseThrow(() -> new RuntimeException("스터디 그룹을 찾을 수 없습니다."));

        if (!group.getUEmail().equals(requesterEmail)) {
            throw new RuntimeException("작성자만 수정할 수 있습니다.");
        }

        curriculumRepository.deleteByStudyGroupId(studyId);

        List<CurriculumWeek> newEntities = dtoList.stream()
                .map(dto -> CurriculumWeek.builder()
                        .week(dto.getWeek())
                        .title(dto.getTitle())
                        .topics(dto.getTopics())
                        .studyGroup(group)
                        .build())
                .toList();

        curriculumRepository.saveAll(newEntities);
    }

}

