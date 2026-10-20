package com.company.placement.execution;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Judge0Status {
    IN_QUEUE(1, "In Queue"),
    PROCESSING(2, "Processing"),
    ACCEPTED(3, "Accepted"),
    WRONG_ANSWER(4, "Wrong Answer"),
    TIME_LIMIT_EXCEEDED(5, "Time Limit Exceeded"),
    COMPILATION_ERROR(6, "Compilation Error"),
    RUNTIME_ERROR_SIGSEGV(7, "Runtime Error (SIGSEGV)"),
    RUNTIME_ERROR_SIGXFSZ(8, "Runtime Error (SIGXFSZ)"),
    RUNTIME_ERROR_SIGFPE(9, "Runtime Error (SIGFPE)"),
    RUNTIME_ERROR_SIGABRT(10, "Runtime Error (SIGABRT)"),
    RUNTIME_ERROR_NZEC(11, "Runtime Error (NZEC)"),
    RUNTIME_ERROR_OTHER(12, "Runtime Error (Other)"),
    INTERNAL_ERROR(13, "Internal Error"),
    EXEC_FORMAT_ERROR(14, "Exec Format Error");

    private final int id;
    private final String description;

    public static Judge0Status fromId(int id) {
        for (Judge0Status s : values()) {
            if (s.id == id) {
                return s;
            }
        }
        return INTERNAL_ERROR;
    }
}
