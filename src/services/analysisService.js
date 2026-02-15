/**
 * Analysis Service
 * Generates preparation plans, checklists, and interview questions based on detected skills
 */

/**
 * Generate round-wise preparation checklist
 * @param {Object} detectedSkills - Skills grouped by category
 * @returns {Array} - Array of rounds with checklists
 */
export function generateRoundwiseChecklist(detectedSkills) {
    const hasWeb = detectedSkills['Web'] || [];
    const hasData = detectedSkills['Data'] || [];
    const hasCloud = detectedSkills['Cloud/DevOps'] || [];
    const hasLanguages = detectedSkills['Languages'] || [];
    const hasCoreCS = detectedSkills['Core CS'] || [];

    return [
        {
            round: 1,
            title: 'Aptitude & Basics',
            items: [
                'Practice quantitative aptitude (numbers, percentages, ratios)',
                'Solve logical reasoning puzzles',
                'Brush up on verbal ability and comprehension',
                'Review basic mathematics and probability',
                'Practice previous years\' aptitude test papers',
                'Time yourself on mock tests (improve speed)'
            ]
        },
        {
            round: 2,
            title: 'DSA & Core CS Fundamentals',
            items: [
                hasCoreCS.length > 0
                    ? 'Master data structures: Arrays, LinkedLists, Trees, Graphs, HashMaps'
                    : 'Learn basic data structures and their operations',
                hasCoreCS.length > 0
                    ? 'Practice algorithmic paradigms: DP, Greedy, Backtracking, Divide & Conquer'
                    : 'Understand sorting and searching algorithms',
                'Revise OOP concepts: Inheritance, Polymorphism, Encapsulation',
                'Study DBMS fundamentals: Normalization, ACID, Joins',
                'Review OS concepts: Processes, Threads, Deadlocks, Memory Management',
                'Understand networking basics: TCP/IP, HTTP, DNS',
                'Solve 50+ coding problems on LeetCode/HackerRank',
                'Focus on time and space complexity analysis'
            ]
        },
        {
            round: 3,
            title: 'Technical Interview (Stack-Specific)',
            items: [
                hasLanguages.length > 0
                    ? `Deep dive into ${hasLanguages.slice(0, 2).join(' and ')}: syntax, best practices, frameworks`
                    : 'Choose a primary language and master its syntax',
                hasWeb.length > 0
                    ? `Study web technologies: ${hasWeb.slice(0, 3).join(', ')}`
                    : 'Learn basics of web development if required',
                hasData.length > 0
                    ? `Practice database queries in ${hasData.slice(0, 2).join(' and ')}`
                    : 'Understand SQL basics and query optimization',
                hasCloud.length > 0
                    ? `Explore ${hasCloud.slice(0, 2).join(' and ')} basics`
                    : 'Familiarize with cloud concepts if relevant',
                'Build 2-3 mini projects showcasing your skills',
                'Prepare to explain your projects in detail',
                'Practice system design basics (scalability, load balancing)',
                'Review your resume and be ready to defend every point'
            ]
        },
        {
            round: 4,
            title: 'Managerial & HR',
            items: [
                'Prepare your "Tell me about yourself" pitch (2-min version)',
                'List your strengths and weaknesses with real examples',
                'Prepare answers for behavioral questions (STAR method)',
                'Research the company: products, culture, recent news',
                'Prepare questions to ask the interviewer',
                'Practice mock HR interviews with peers',
                'Be ready to discuss salary expectations and career goals'
            ]
        }
    ];
}

/**
 * Generate 7-day study plan
 * @param {Object} detectedSkills - Skills grouped by category
 * @returns {Array} - Day-wise plan
 */
export function generate7DayPlan(detectedSkills) {
    const hasWeb = detectedSkills['Web'] || [];
    const hasCoreCS = detectedSkills['Core CS'] || [];
    const hasLanguages = detectedSkills['Languages'] || [];

    const primaryLang = hasLanguages[0] || 'your preferred language';
    const webTech = hasWeb[0] || 'web development';

    return [
        {
            day: 1,
            title: 'Basics & Core CS',
            tasks: [
                'Revise OOP principles with code examples',
                'Study DBMS normalization and transactions',
                `Write basic ${primaryLang} programs to warm up`,
                'Solve 5 easy array/string problems'
            ]
        },
        {
            day: 2,
            title: 'Core CS Deep Dive',
            tasks: [
                'OS concepts: Process scheduling, deadlocks',
                'Networking: TCP/IP, HTTP/HTTPS differences',
                'DBMS: Practice SQL joins and subqueries',
                'Solve 5 medium DSA problems'
            ]
        },
        {
            day: 3,
            title: 'DSA Focus - Part 1',
            tasks: [
                'Trees and Graphs: BFS, DFS, Traversals',
                'Practice 5-7 tree/graph problems',
                'Review recursion and backtracking',
                'Time complexity analysis practice'
            ]
        },
        {
            day: 4,
            title: 'DSA Focus - Part 2',
            tasks: [
                'Dynamic Programming: Top patterns (knapsack, LIS, LCS)',
                'Solve 5 DP problems from easy to medium',
                'Practice sliding window and two-pointer technique',
                'Review sorting algorithms and their complexities'
            ]
        },
        {
            day: 5,
            title: 'Stack-Specific & Projects',
            tasks: [
                hasWeb.length > 0
                    ? `Build a small ${webTech} demo (TODO app or dashboard)`
                    : 'Work on a mini project in your domain',
                `Revise ${primaryLang} advanced concepts`,
                'Practice explaining your projects clearly',
                'Update resume with recent work'
            ]
        },
        {
            day: 6,
            title: 'Mock Interviews',
            tasks: [
                'Take 2 coding mock interviews (friends/online)',
                'Practice system design questions (URL shortener, LRU cache)',
                'Prepare answers for HR questions',
                'Research target companies thoroughly'
            ]
        },
        {
            day: 7,
            title: 'Revision & Weak Areas',
            tasks: [
                'Revise topics you struggled with',
                'Solve 10 random problems from different topics',
                'Review notes and important formulas',
                'Relax, sleep well, and stay confident!'
            ]
        }
    ];
}

/**
 * Generate interview questions based on skills
 * @param {Object} detectedSkills - Skills grouped by category
 * @returns {Array} - Interview questions
 */
export function generateInterviewQuestions(detectedSkills) {
    const questions = [];

    // Core CS questions
    if (detectedSkills['Core CS']) {
        questions.push(
            'Explain the difference between process and thread. When would you use each?',
            'What is database normalization? Why is it important?',
            'Describe how a HashMap works internally. What is its time complexity?'
        );
    }

    // DSA questions (always relevant)
    questions.push(
        'How would you optimize search in a sorted array? What about unsorted?',
        'Explain dynamic programming. Give an example where you\'d use it.'
    );

    // Language-specific
    if (detectedSkills['Languages']) {
        const langs = detectedSkills['Languages'];
        if (langs.some(l => l.toLowerCase().includes('java'))) {
            questions.push('What is the difference between abstract class and interface in Java?');
        } else if (langs.some(l => l.toLowerCase().includes('python'))) {
            questions.push('Explain list comprehension and generators in Python.');
        } else {
            questions.push(`What are the key features of ${langs[0]}?`);
        }
    }

    // Web questions
    if (detectedSkills['Web']) {
        const webSkills = detectedSkills['Web'];
        if (webSkills.some(s => s.toLowerCase().includes('react'))) {
            questions.push('Explain state management in React. What are hooks?');
        }
        if (webSkills.some(s => s.toLowerCase().includes('node'))) {
            questions.push('How does Node.js handle asynchronous operations?');
        } else {
            questions.push('What is the difference between REST and GraphQL?');
        }
    }

    // Data questions
    if (detectedSkills['Data']) {
        const dataSkills = detectedSkills['Data'];
        if (dataSkills.some(s => s.toLowerCase().includes('sql'))) {
            questions.push('Explain indexing in databases. When does it help performance?');
        }
        if (dataSkills.some(s => s.toLowerCase().includes('mongo'))) {
            questions.push('What is the difference between SQL and NoSQL databases?');
        }
    }

    // Cloud/DevOps questions
    if (detectedSkills['Cloud/DevOps']) {
        questions.push('What are the benefits of containerization with Docker?');
    }

    // Fill up to 10 questions with general ones
    const generalQuestions = [
        'Walk me through your most challenging project. What problem did you solve?',
        'How do you approach debugging a complex issue?',
        'Explain a time when you optimized code. What was the impact?',
        'What is your approach to learning new technologies?',
        'How would you design a scalable system for millions of users?'
    ];

    while (questions.length < 10) {
        questions.push(generalQuestions[questions.length % generalQuestions.length]);
    }

    return questions.slice(0, 10);
}

/**
 * Calculate readiness score
 * @param {Object} jdData - {company, role, jdText}
 * @param {Object} skillData - {detectedSkills, totalSkillsFound}
 * @returns {number} - Score 0-100
 */
export function calculateReadinessScore(jdData, skillData) {
    let score = 35; // Base score

    // +5 per skill category (max 30)
    const categoryCount = Object.keys(skillData.detectedSkills).filter(
        cat => cat !== 'General'
    ).length;
    score += Math.min(categoryCount * 5, 30);

    // +10 if company provided
    if (jdData.company && jdData.company.trim().length > 0) {
        score += 10;
    }

    // +10 if role provided
    if (jdData.role && jdData.role.trim().length > 0) {
        score += 10;
    }

    // +10 if JD length > 800 chars
    if (jdData.jdText && jdData.jdText.length > 800) {
        score += 10;
    }

    // Cap at 100
    return Math.min(score, 100);
}
