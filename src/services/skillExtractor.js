/**
 * Skill Extraction Service
 * Detects skills from JD text using keyword matching
 */

// Skill categories with keywords
const SKILL_CATEGORIES = {
    'Core CS': [
        'dsa', 'data structures', 'algorithms', 'oop', 'object oriented',
        'object-oriented', 'dbms', 'database', 'os', 'operating system',
        'networks', 'networking', 'computer networks'
    ],
    'Languages': [
        'java', 'python', 'javascript', 'typescript', 'c++', 'cpp',
        'c programming', 'c#', 'csharp', 'go', 'golang', 'rust'
    ],
    'Web': [
        'react', 'reactjs', 'next.js', 'nextjs', 'node.js', 'nodejs',
        'express', 'expressjs', 'rest', 'restful', 'rest api',
        'graphql', 'html', 'css', 'angular', 'vue', 'vuejs'
    ],
    'Data': [
        'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo',
        'redis', 'database', 'nosql', 'sqlite'
    ],
    'Cloud/DevOps': [
        'aws', 'amazon web services', 'azure', 'microsoft azure',
        'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
        'ci/cd', 'cicd', 'jenkins', 'linux', 'unix', 'git', 'github'
    ],
    'Testing': [
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
    if (!jdText || typeof jdText !== 'string') {
        return { detectedSkills: {}, hasSkills: false };
    }

    const lowerText = jdText.toLowerCase();
    const detectedSkills = {};
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

    // If no skills detected, provide fallback
    const hasSkills = totalSkillsFound > 0;
    if (!hasSkills) {
        detectedSkills['General'] = ['Basic Programming', 'Problem Solving', 'Communication'];
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
    return Object.keys(detectedSkills).filter(cat => cat !== 'General').length;
}
