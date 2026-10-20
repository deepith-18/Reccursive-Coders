package com.company.placement.execution;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProgrammingLanguage {
    PYTHON(71, "Python (3.8.1)", "python"),
    JAVA(62, "Java (OpenJDK 13.0.1)", "java"),
    CPP(54, "C++ (GCC 9.2.0)", "cpp");

    private final int judge0Id;
    private final String displayName;
    private final String alias;

    public static ProgrammingLanguage fromString(String text) {
        if (text == null) return PYTHON;
        for (ProgrammingLanguage lang : values()) {
            if (lang.name().equalsIgnoreCase(text) || lang.alias.equalsIgnoreCase(text)) {
                return lang;
            }
        }
        return PYTHON;
    }
}
