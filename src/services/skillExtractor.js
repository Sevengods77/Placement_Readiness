/**
 * Skill Extraction Service
 * Detects skills from JD text using keyword matching
 */

import { createEmptySkillsObject } from './schemaValidator.js';

// Skill categories with keywords (mapped to standardized schema keys)
const SKILL_CATEGORIES = {
    'coreCS': [
        'dsa', 'data structures', 'algorithms', 'oop', 'object oriented',
        'object-oriented', 'dbms', 'database', 'os', 'operating system',
        'networks', 'networking', 'computer networks'
    ],
    'languages': [
        'java', 'python', 'javascript', 'typescript', 'c++', 'cpp',
        'c programming', 'c#', 'csharp', 'go', 'golang', 'rust'
    ],
    'web': [
        'react', 'reactjs', 'next.js', 'nextjs', 'node.js', 'nodejs',
        'express', 'expressjs', 'rest', 'restful', 'rest api',
        'graphql', 'html', 'css', 'angular', 'vue', 'vuejs'
    ],
    'data': [
        'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo',
        'redis', 'database', 'nosql', 'sqlite'
    ],
    'cloud': [
        'aws', 'amazon web services', 'azure', 'microsoft azure',
        'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
        'ci/cd', 'cicd', 'jenkins', 'linux', 'unix', 'git', 'github'
    ],
    'testing': [
        'selenium', 'cypress', 'playwright', 'junit', 'pytest',
        'testing', 'test automation', 'jest', 'mocha'
    ]
};

/**
 * Extract skills from JD text
 * @param {string} jdText - Job description text
 * @returns {Object} - Detected skills grouped by category
 */
export function extractSkills(jdText) {
    // Always start with empty structure
    const detectedSkills = createEmptySkillsObject();

    if (!jdText || typeof jdText !== 'string') {
        // Return empty structure with default skills
        detectedSkills.other = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];
        return {
            detectedSkills,
            hasSkills: false,
            totalSkillsFound: 0
        };
    }

    const lowerText = jdText.toLowerCase();
    let totalSkillsFound = 0;

    // Check each category
    Object.entries(SKILL_CATEGORIES).forEach(([category, keywords]) => {
        const foundSkills = new Set();

        keywords.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                // Add the formatted skill name (capitalize first letter of each word)
                const skillName = keyword
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                foundSkills.add(skillName);
            }
        });

        if (foundSkills.size > 0) {
            detectedSkills[category] = Array.from(foundSkills);
            totalSkillsFound += foundSkills.size;
        }
    });

    // If no skills detected, populate "other" with default skills
    const hasSkills = totalSkillsFound > 0;
    if (!hasSkills) {
        detectedSkills.other = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];
    }

    return {
        detectedSkills,
        hasSkills,
        totalSkillsFound
    };
}

/**
 * Get count of categories with detected skills
 * @param {Object} detectedSkills
 * @returns {number}
 */
export function getSkillCategoryCount(detectedSkills) {
    return Object.keys(detectedSkills).filter(cat =>
        cat !== 'other' && detectedSkills[cat] && detectedSkills[cat].length > 0
    ).length;
}
