package com.company.placement.auth;

import com.company.placement.assignment.Assignment;
import com.company.placement.assignment.AssignmentQuestion;
import com.company.placement.assignment.AssignmentQuestionRepository;
import com.company.placement.assignment.AssignmentRepository;
import com.company.placement.assignment.AssignmentStatus;
import com.company.placement.batch.Batch;
import com.company.placement.batch.BatchRepository;
import com.company.placement.batch.BatchStatus;
import com.company.placement.batch.BatchStudent;
import com.company.placement.batch.BatchStudentRepository;
import com.company.placement.question.Question;
import com.company.placement.question.QuestionDifficulty;
import com.company.placement.question.QuestionRepository;
import com.company.placement.question.QuestionStatus;
import com.company.placement.question.TestCase;
import com.company.placement.user.Role;
import com.company.placement.user.User;
import com.company.placement.user.UserRepository;
import com.company.placement.user.UserStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BatchRepository batchRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final QuestionRepository questionRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final com.company.placement.placement.PlacementDriveRepository placementDriveRepository;
    private final com.company.placement.notification.NotificationRepository notificationRepository;
    private final com.company.placement.assessment.AssessmentRepository assessmentRepository;

    @Override
    public void run(String... args) {
        log.info("Checking and seeding demo dataset for Admin, Trainer, and Student roles...");

        // 1. Admin Account
        User admin = userRepository.findByEmailIgnoreCase("admin@company.com").orElseGet(() -> {
            log.info("Seeding initial administrator account: admin@company.com");
            return userRepository.save(User.builder()
                    .email("admin@company.com")
                    .fullName("Platform Administrator")
                    .passwordHash(passwordEncoder.encode("AdminPassword123!"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .forcePasswordChange(false)
                    .phone("+91 9999999999")
                    .build());
        });

        // 2. Trainer Account
        User trainer = userRepository.findByEmailIgnoreCase("trainer@company.com").orElseGet(() -> {
            log.info("Seeding trainer account: trainer@company.com");
            return userRepository.save(User.builder()
                    .email("trainer@company.com")
                    .fullName("Sarah Jenkins (Lead Trainer)")
                    .passwordHash(passwordEncoder.encode("Welcome@2026!"))
                    .role(Role.TRAINER)
                    .status(UserStatus.ACTIVE)
                    .forcePasswordChange(false)
                    .phone("+91 9888888888")
                    .build());
        });

        // 3. Student Account
        User student = userRepository.findByEmailIgnoreCase("student@company.com").orElseGet(() -> {
            log.info("Seeding student account: student@company.com");
            return userRepository.save(User.builder()
                    .email("student@company.com")
                    .fullName("Alex Chen")
                    .passwordHash(passwordEncoder.encode("Welcome@2026!"))
                    .role(Role.STUDENT)
                    .status(UserStatus.ACTIVE)
                    .forcePasswordChange(false)
                    .phone("+91 9777777777")
                    .build());
        });

        // 4. Batch: Full-Stack Placement 2026
        Batch batch = batchRepository.findByCodeIgnoreCase("FS-2026-A").orElseGet(() -> {
            log.info("Seeding cohort batch FS-2026-A");
            return batchRepository.save(Batch.builder()
                    .name("Full-Stack Algorithms Cohort 2026")
                    .code("FS-2026-A")
                    .description("Intensive training on Data Structures, Algorithms, System Design & Interview Readiness")
                    .trainer(trainer)
                    .status(BatchStatus.ACTIVE)
                    .startDate(LocalDate.now().minusWeeks(2))
                    .endDate(LocalDate.now().plusMonths(6))
                    .build());
        });

        // 5. Enroll student into batch
        if (!batchStudentRepository.existsByBatchIdAndStudentId(batch.getId(), student.getId())) {
            log.info("Enrolling student into batch FS-2026-A");
            batchStudentRepository.save(BatchStudent.builder()
                    .batch(batch)
                    .student(student)
                    .enrolledAt(Instant.now().minus(10, ChronoUnit.DAYS))
                    .build());
        }

        // 6. Seed Coding Questions
        List<Question> seededQuestions = new ArrayList<>();

        if (!questionRepository.existsBySlugIgnoreCase("two-sum")) {
            Question q1 = Question.builder()
                    .title("Two Sum")
                    .slug("two-sum")
                    .difficulty(QuestionDifficulty.EASY)
                    .tags("Array, Hash Table, LeetCode 1")
                    .timeLimitMs(2000)
                    .memoryLimitMb(256)
                    .author(trainer)
                    .status(QuestionStatus.PUBLISHED)
                    .description("Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n### Input Format:\n- Line 1: `N Target`\n- Line 2: `N` space-separated integers\n\n### Output Format:\n- Two 0-indexed space-separated indices in ascending order.")
                    .starterCodePython("import sys\n\ndef main():\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    n = int(lines[0])\n    target = int(lines[1])\n    nums = [int(x) for x in lines[2:2+n]]\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            print(f\"{seen[complement]} {i}\")\n            return\n        seen[num] = i\n\nif __name__ == '__main__':\n    main()\n")
                    .starterCodeJava("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                System.out.println(map.get(comp) + \" \" + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}\n")
                    .starterCodeCpp("#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n, target;\n    if (!(cin >> n >> target)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    unordered_map<int, int> mp;\n    for (int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if (mp.count(comp)) {\n            cout << mp[comp] << \" \" << i << endl;\n            return 0;\n        }\n        mp[nums[i]] = i;\n    }\n    return 0;\n}\n")
                    .build();

            TestCase tc1 = TestCase.builder()
                    .question(q1)
                    .inputData("4 9\n2 7 11 15")
                    .expectedOutput("0 1")
                    .isSample(true)
                    .explanation("nums[0] + nums[1] == 2 + 7 == 9, indices 0 and 1.")
                    .orderIndex(1)
                    .build();

            TestCase tc2 = TestCase.builder()
                    .question(q1)
                    .inputData("3 6\n3 2 4")
                    .expectedOutput("1 2")
                    .isSample(false)
                    .explanation("nums[1] + nums[2] == 2 + 4 == 6, indices 1 and 2.")
                    .orderIndex(2)
                    .build();

            q1.getTestCases().add(tc1);
            q1.getTestCases().add(tc2);
            seededQuestions.add(questionRepository.save(q1));
            log.info("Seeded Question: Two Sum");
        }

        if (!questionRepository.existsBySlugIgnoreCase("reverse-string")) {
            Question q2 = Question.builder()
                    .title("Reverse a String")
                    .slug("reverse-string")
                    .difficulty(QuestionDifficulty.EASY)
                    .tags("String, Two Pointers")
                    .timeLimitMs(1000)
                    .memoryLimitMb(256)
                    .author(trainer)
                    .status(QuestionStatus.PUBLISHED)
                    .description("Given a string `s`, reverse it and print the result.\n\n### Input:\n- A single string on standard input.\n\n### Output:\n- The reversed string.")
                    .starterCodePython("import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    print(s[::-1])\n\nif __name__ == '__main__':\n    main()\n")
                    .starterCodeJava("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine().trim();\n            System.out.println(new StringBuilder(s).reverse().toString());\n        }\n    }\n}\n")
                    .starterCodeCpp("#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        reverse(s.begin(), s.end());\n        cout << s << endl;\n    }\n    return 0;\n}\n")
                    .build();

            TestCase tc1 = TestCase.builder()
                    .question(q2)
                    .inputData("hello")
                    .expectedOutput("olleh")
                    .isSample(true)
                    .orderIndex(1)
                    .build();

            TestCase tc2 = TestCase.builder()
                    .question(q2)
                    .inputData("RecursiveCoders")
                    .expectedOutput("sredoCevisruceR")
                    .isSample(false)
                    .orderIndex(2)
                    .build();

            q2.getTestCases().add(tc1);
            q2.getTestCases().add(tc2);
            seededQuestions.add(questionRepository.save(q2));
            log.info("Seeded Question: Reverse a String");
        }

        if (!questionRepository.existsBySlugIgnoreCase("valid-palindrome")) {
            Question q3 = Question.builder()
                    .title("Valid Palindrome")
                    .slug("valid-palindrome")
                    .difficulty(QuestionDifficulty.EASY)
                    .tags("String, Two Pointers, LeetCode 125")
                    .timeLimitMs(1000)
                    .memoryLimitMb(256)
                    .author(trainer)
                    .status(QuestionStatus.PUBLISHED)
                    .description("A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nOutput `true` if it is a palindrome, or `false` otherwise.")
                    .starterCodePython("import sys\n\ndef main():\n    raw = sys.stdin.read().strip().lower()\n    cleaned = ''.join(ch for ch in raw if ch.isalnum())\n    print(\"true\" if cleaned == cleaned[::-1] else \"false\")\n\nif __name__ == '__main__':\n    main()\n")
                    .starterCodeJava("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String raw = sc.nextLine().toLowerCase();\n        StringBuilder sb = new StringBuilder();\n        for (char c : raw.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) sb.append(c);\n        }\n        String s = sb.toString();\n        String rev = sb.reverse().toString();\n        System.out.println(s.equals(rev) ? \"true\" : \"false\");\n    }\n}\n")
                    .starterCodeCpp("#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string line, s = \"\";\n    if (!getline(cin, line)) return 0;\n    for (char c : line) {\n        if (isalnum((unsigned char)c)) s += tolower((unsigned char)c);\n    }\n    int l = 0, r = s.length() - 1;\n    bool ok = true;\n    while (l < r) {\n        if (s[l++] != s[r--]) { ok = false; break; }\n    }\n    cout << (ok ? \"true\" : \"false\") << endl;\n    return 0;\n}\n")
                    .build();

            TestCase tc1 = TestCase.builder()
                    .question(q3)
                    .inputData("racecar")
                    .expectedOutput("true")
                    .isSample(true)
                    .orderIndex(1)
                    .build();

            TestCase tc2 = TestCase.builder()
                    .question(q3)
                    .inputData("placement")
                    .expectedOutput("false")
                    .isSample(false)
                    .orderIndex(2)
                    .build();

            q3.getTestCases().add(tc1);
            q3.getTestCases().add(tc2);
            seededQuestions.add(questionRepository.save(q3));
            log.info("Seeded Question: Valid Palindrome");
        }

        // 7. Seed Assignment for the batch
        List<Assignment> existingAssignments = assignmentRepository.findByBatchIdOrderByDueDateAsc(batch.getId());
        if (existingAssignments.isEmpty()) {
            Assignment assignment = assignmentRepository.save(Assignment.builder()
                    .batch(batch)
                    .title("Sprint 1: Core Problem Solving & Algorithms")
                    .description("Master basic arrays, hash maps, and two-pointer techniques. All test cases must pass for full score.")
                    .startDate(Instant.now().minus(2, ChronoUnit.DAYS))
                    .dueDate(Instant.now().plus(14, ChronoUnit.DAYS))
                    .status(AssignmentStatus.PUBLISHED)
                    .author(trainer)
                    .build());

            int idx = 1;
            List<Question> allQuestions = questionRepository.findAll();
            for (Question q : allQuestions) {
                if (idx > 3) break;
                assignmentQuestionRepository.save(AssignmentQuestion.builder()
                        .assignment(assignment)
                        .question(q)
                        .points(10)
                        .orderIndex(idx++)
                        .build());
            }
            log.info("Seeded Assignment: Sprint 1 with questions attached.");
        }

        // 8. Seed Recruitment Placement Drives (Phase 6)
        if (placementDriveRepository.count() == 0) {
            placementDriveRepository.save(com.company.placement.placement.PlacementDrive.builder()
                    .title("Amazon Software Development Engineer Recruitment Drive 2026")
                    .companyName("Amazon")
                    .companyLogoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg")
                    .jobRole("Software Development Engineer (SDE-1)")
                    .description("Join Amazon Web Services & Consumer Tech teams in Bengaluru. Candidates must demonstrate deep knowledge of Data Structures, Algorithms, Distributed Systems, and Object-Oriented Design in Java/Python.")
                    .packageCtcLpa(new java.math.BigDecimal("18.50"))
                    .location("Bengaluru, Karnataka (Hybrid)")
                    .minCgpa(7.5)
                    .eligibleBranches("CSE, ISE, ECE, EEE, AI/DS")
                    .minCodingScore(50)
                    .driveDate(Instant.now().plus(7, ChronoUnit.DAYS))
                    .applicationDeadline(Instant.now().plus(5, ChronoUnit.DAYS))
                    .status(com.company.placement.placement.DriveStatus.OPEN)
                    .openingsCount(15)
                    .creator(admin)
                    .build());

            placementDriveRepository.save(com.company.placement.placement.PlacementDrive.builder()
                    .title("Recursive Coders Tier-1 Partner Drive: Full Stack Engineer")
                    .companyName("FastTrack Technologies")
                    .companyLogoUrl("https://images.unsplash.com/photo-1549924231-f129b911e442?w=100")
                    .jobRole("Full Stack Java & React Engineer")
                    .description("High-growth enterprise product engineering firm hiring for core platform development. Strong expertise in Spring Boot, PostgreSQL, React, and RESTful Microservices required.")
                    .packageCtcLpa(new java.math.BigDecimal("9.00"))
                    .location("Vijayanagara, Bengaluru")
                    .minCgpa(6.5)
                    .eligibleBranches("All Engineering Branches & MCA")
                    .minCodingScore(30)
                    .driveDate(Instant.now().plus(10, ChronoUnit.DAYS))
                    .applicationDeadline(Instant.now().plus(8, ChronoUnit.DAYS))
                    .status(com.company.placement.placement.DriveStatus.OPEN)
                    .openingsCount(20)
                    .creator(admin)
                    .build());

            placementDriveRepository.save(com.company.placement.placement.PlacementDrive.builder()
                    .title("React Native & Mobile Engineering Placement Drive")
                    .companyName("Recursive Coders Bengaluru")
                    .companyLogoUrl("/recursive-coders-logo.png")
                    .jobRole("React Native Specialist Intern & FTE")
                    .description("Design high-performance cross-platform mobile apps using React Native, TypeScript, Redux Toolkit, and native mobile bridges. Excellent opportunity with fast-track promotion.")
                    .packageCtcLpa(new java.math.BigDecimal("3.50"))
                    .location("Bengaluru, India")
                    .minCgpa(6.0)
                    .eligibleBranches("BE/BTech, MCA, BSc CS (2025/2026)")
                    .minCodingScore(20)
                    .driveDate(Instant.now().plus(14, ChronoUnit.DAYS))
                    .applicationDeadline(Instant.now().plus(12, ChronoUnit.DAYS))
                    .status(com.company.placement.placement.DriveStatus.OPEN)
                    .openingsCount(10)
                    .creator(trainer)
                    .build());

            log.info("Seeded 3 authentic placement recruitment drives.");
        }

        // 9. Seed Student Alerts & Notifications
        if (notificationRepository.count() == 0) {
            notificationRepository.save(com.company.placement.notification.Notification.builder()
                    .userId(student.getId())
                    .title("Welcome to Recursive Coders!")
                    .message("Explore the coding arena, practice core DSA problems, and verify your profile.")
                    .type(com.company.placement.notification.NotificationType.SYSTEM_ALERT)
                    .linkUrl("/student/practice")
                    .read(false)
                    .build());

            notificationRepository.save(com.company.placement.notification.Notification.builder()
                    .userId(student.getId())
                    .title("Amazon SDE-1 Drive Open (18.5 LPA)")
                    .message("The Amazon campus placement drive is now accepting applications. Check eligibility criteria.")
                    .type(com.company.placement.notification.NotificationType.PLACEMENT_UPDATE)
                    .linkUrl("/student/placements")
                    .read(false)
                    .build());

            notificationRepository.save(com.company.placement.notification.Notification.builder()
                    .userId(student.getId())
                    .title("Sprint 1 Assignment Available")
                    .message("Assignment Sprint 1 has been scheduled for your cohort FS-2026-A.")
                    .type(com.company.placement.notification.NotificationType.ASSIGNMENT_POSTED)
                    .linkUrl("/student/assignments")
                    .read(false)
                    .build());

            log.info("Seeded 3 authentic demo notifications for student.");
        }

        // 10. Seed Authentic Mock Assessments & Contests (Phase 9)
        if (assessmentRepository.count() == 0) {
            assessmentRepository.save(com.company.placement.assessment.Assessment.builder()
                    .title("Amazon SDE-1 Comprehensive Mock Assessment")
                    .description("Full-pattern technical screening featuring 2 DSA algorithmic challenges and system architecture questions under timed conditions.")
                    .companyTag("Amazon")
                    .type(com.company.placement.assessment.AssessmentType.MOCK_DRIVE)
                    .status(com.company.placement.assessment.AssessmentStatus.ACTIVE)
                    .proctoringLevel(com.company.placement.assessment.ProctoringLevel.STRICT)
                    .durationMinutes(75)
                    .maxViolationsAllowed(3)
                    .passingScore(70)
                    .totalPoints(100)
                    .startsAt(Instant.now())
                    .endsAt(Instant.now().plus(14, ChronoUnit.DAYS))
                    .createdBy(trainer)
                    .build());

            assessmentRepository.save(com.company.placement.assessment.Assessment.builder()
                    .title("TCS Digital National Qualifier Mock Contest")
                    .description("Timed contest modeling the latest TCS Digital recruitment test with advanced data structures, sliding window, and graph traversal.")
                    .companyTag("TCS Digital")
                    .type(com.company.placement.assessment.AssessmentType.CODING_CONTEST)
                    .status(com.company.placement.assessment.AssessmentStatus.ACTIVE)
                    .proctoringLevel(com.company.placement.assessment.ProctoringLevel.STRICT)
                    .durationMinutes(90)
                    .maxViolationsAllowed(3)
                    .passingScore(60)
                    .totalPoints(100)
                    .startsAt(Instant.now())
                    .endsAt(Instant.now().plus(10, ChronoUnit.DAYS))
                    .createdBy(trainer)
                    .build());

            assessmentRepository.save(com.company.placement.assessment.Assessment.builder()
                    .title("Dynamic Programming Master Sprint")
                    .description("Intense topic assessment on Knapsack patterns, Longest Common Subsequence, and Multi-dimensional Memoization.")
                    .companyTag("Recursive Coders")
                    .type(com.company.placement.assessment.AssessmentType.TOPIC_SPRINT)
                    .status(com.company.placement.assessment.AssessmentStatus.ACTIVE)
                    .proctoringLevel(com.company.placement.assessment.ProctoringLevel.MODERATE)
                    .durationMinutes(60)
                    .maxViolationsAllowed(5)
                    .passingScore(65)
                    .totalPoints(100)
                    .startsAt(Instant.now())
                    .endsAt(Instant.now().plus(7, ChronoUnit.DAYS))
                    .createdBy(trainer)
                    .build());

            log.info("Seeded 3 authentic mock assessments and coding contests for Phase 9.");
        }

        log.info("Demo dataset initialization completed successfully.");
    }
}
