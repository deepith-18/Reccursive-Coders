package com.company.placement.assessment;

import com.company.placement.common.audit.BaseEntity;
import com.company.placement.question.Question;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assessment_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentQuestion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "section_name", length = 100)
    @Builder.Default
    private String sectionName = "Core Algorithms";

    @Column(nullable = false)
    @Builder.Default
    private Integer points = 25;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 1;
}
