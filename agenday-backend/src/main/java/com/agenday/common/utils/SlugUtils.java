package com.agenday.common.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtils {

    private static final Pattern NON_LATIN = Pattern.compile("[^a-z0-9\\s-]");
    private static final Pattern WHITESPACE = Pattern.compile("\\s+");
    private static final Pattern MULTIPLE_HYPHENS = Pattern.compile("-+");


    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Input para geração de slug não pode ser vazio");
        }

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        String slug = normalized
                .toLowerCase()
                .trim();

        slug = NON_LATIN.matcher(slug).replaceAll("");
        slug = WHITESPACE.matcher(slug).replaceAll("-");
        slug = MULTIPLE_HYPHENS.matcher(slug).replaceAll("-");

        return slug;
    }
}