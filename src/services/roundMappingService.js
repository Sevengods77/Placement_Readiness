/**
 * Round Mapping Service
 * Generates dynamic interview round mapping based on company size and detected skills
 */

/**
 * Generate dynamic round mapping
 * @param {string} companySize - 'Enterprise', 'Mid-size', or 'Startup'
 * @param {object} detectedSkills - Skills by category
 * @returns {array} - Array of round objects
 */
export function generateRoundMapping(companySize, detectedSkills) {
    const hasWebDev = detectedSkills['Web Development']?.length > 0;
    const hasDSA = detectedSkills['Core CS']?.length > 0 ||
        detectedSkills['Languages & Frameworks']?.length > 0;
    const hasCloud = detectedSkills['Cloud & DevOps']?.length > 0;
    const hasData = detectedSkills['Data & Databases']?.length > 0;

    // Enterprise round mapping
    if (companySize === 'Enterprise') {
        return [
            {
                number: 1,
                title: 'Online Assessment',
                type: 'automated',
                focus: 'DSA + Aptitude + MCQs',
                duration: '60-90 mins',
                whyItMatters: 'First filter to test coding speed and fundamental knowledge. Practice timed problems on platforms like LeetCode.',
                tips: ['Focus on medium difficulty problems', 'Time management is critical', 'Review basic CS concepts']
            },
            {
                number: 2,
                title: 'Technical Round 1',
                type: 'interview',
                focus: 'DSA Deep Dive + Problem Solving',
                duration: '45-60 mins',
                whyItMatters: 'Tests algorithmic thinking and coding clarity. Interviewers assess problem approach, optimization, and edge cases.',
                tips: ['Think out loud', 'Start with brute force, then optimize', 'Consider time/space complexity']
            },
            {
                number: 3,
                title: 'Technical Round 2',
                type: 'interview',
                focus: hasDSA ? 'System Design + Core CS' : 'Projects + Technical Depth',
                duration: '45-60 mins',
                whyItMatters: 'Evaluates design thinking and real-world application knowledge. For senior roles, system design is crucial.',
                tips: ['Know your projects deeply', 'Understand scalability concepts', 'Be ready to draw diagrams']
            },
            {
                number: 4,
                title: 'Managerial/HR Round',
                type: 'behavioral',
                focus: 'Cultural Fit + Behavioral Questions',
                duration: '30-45 mins',
                whyItMatters: 'Final assessment of soft skills, team fit, and long-term potential. Honesty and clarity matter most.',
                tips: ['Use STAR method for stories', 'Show enthusiasm', 'Ask thoughtful questions']
            }
        ];
    }

    // Mid-size company mapping
    if (companySize === 'Mid-size') {
        return [
            {
                number: 1,
                title: 'Screening Round',
                type: 'automated',
                focus: hasDSA ? 'Coding + Technical MCQs' : 'Practical Coding Task',
                duration: '45-60 mins',
                whyItMatters: 'Tests baseline coding ability and tech knowledge. More focused on practical coding than pure algorithmic puzzles.',
                tips: ['Code should be clean and readable', 'Handle edge cases', 'Add comments where needed']
            },
            {
                number: 2,
                title: 'Technical Discussion',
                type: 'interview',
                focus: hasWebDev ? 'Stack Discussion + Live Coding' : 'Problem Solving + Concepts',
                duration: '60 mins',
                whyItMatters: 'Deep dive into your tech stack and project experience. Be ready to explain architectural decisions.',
                tips: ['Know your resume projects inside-out', 'Explain trade-offs clearly', 'Discuss challenges you faced']
            },
            {
                number: 3,
                title: 'Founder/Manager Round',
                type: 'mixed',
                focus: 'Culture + Problem Approach + Growth Mindset',
                duration: '30-45 mins',
                whyItMatters: 'Combination of technical validation and cultural assessment. Mid-size companies value adaptability.',
                tips: ['Show learning ability', 'Be authentic', 'Demonstrate initiative']
            }
        ];
    }

    // Startup round mapping
    return [
        {
            number: 1,
            title: 'Practical Coding Challenge',
            type: 'task',
            focus: hasWebDev ? 'Build a feature or mini-project' : 'Solve real-world problem',
            duration: '2-3 hours (take-home)',
            whyItMatters: 'Startups prioritize shipping ability over theoretical knowledge. This tests how you build real features.',
            tips: ['Focus on working code first', 'Write clean, maintainable code', 'Add basic documentation']
        },
        {
            number: 2,
            title: 'Technical Discussion',
            type: 'interview',
            focus: 'Code Review + System Thinking',
            duration: '60 mins',
            whyItMatters: 'Review of your submission + discussion of how you\'d scale or improve it. Tests practical engineering sense.',
            tips: ['Be ready to defend your choices', 'Discuss what you\'d improve with more time', 'Show pragmatism']
        },
        {
            number: 3,
            title: 'Founder/Team Round',
            type: 'cultural',
            focus: 'Culture Fit + Ownership Mindset',
            duration: '30-45 mins',
            whyItMatters: 'Startups need people who can wear many hats and take ownership. They assess if you fit the fast-paced environment.',
            tips: ['Show passion and energy', 'Emphasize learning and growth', 'Be honest about interests']
        }
    ];
}

/**
 * Get round type color for UI
 * @param {string} type 
 * @returns {string} - Tailwind color class
 */
export function getRoundTypeColor(type) {
    const colors = {
        'automated': 'bg-blue-50 text-blue-700 border-blue-200',
        'interview': 'bg-purple-50 text-purple-700 border-purple-200',
        'behavioral': 'bg-green-50 text-green-700 border-green-200',
        'mixed': 'bg-amber-50 text-amber-700 border-amber-200',
        'task': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'cultural': 'bg-pink-50 text-pink-700 border-pink-200'
    };

    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
}
