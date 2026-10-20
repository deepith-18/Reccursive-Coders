package com.company.placement.execution;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProgrammingLanguage {
    PYTHON(71, "Python (3.10)", "python"),
    JAVA(91, "Java 21 (OpenJDK 21.0.2)", "java"),
    CPP(54, "C++ (GCC 13.2.0)", "cpp"),
    JAVASCRIPT(63, "JavaScript (Node.js 20)", "javascript");

    private final int judge0Id;
    private final String displayName;
    private final String alias;

    public static ProgrammingLanguage fromString(String text) {
        if (text == null) return PYTHON;
        for (ProgrammingLanguage lang : values()) {
            if (lang.name().equalsIgnoreCase(text) || 
                lang.alias.equalsIgnoreCase(text) ||
                ("js".equalsIgnoreCase(text) && lang == JAVASCRIPT)) {
                return lang;
            }
        }
        return PYTHON;
    }
}
