/**
 * Company Intel Service
 * Provides heuristic-based company insights
 */

// Known enterprise companies
const ENTERPRISE_COMPANIES = [
    'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Facebook',
    'Netflix', 'Adobe', 'Oracle', 'SAP', 'IBM', 'Salesforce',
    'Infosys', 'TCS', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini',
    'HCL', 'Tech Mahindra', 'LTI', 'Mindtree', 'Mphasis',
    'Dell', 'HP', 'Cisco', 'Intel', 'NVIDIA', 'Qualcomm',
    'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Citi', 'HSBC',
    'Walmart', 'Target', 'Uber', 'Airbnb', 'LinkedIn'
];

// Mid-size companies
const MIDSIZE_COMPANIES = [
    'Atlassian', 'Shopify', 'Stripe', 'Twilio', 'Snowflake',
    'Databricks', 'Confluent', 'MongoDB', 'Redis', 'Elastic',
    'Freshworks', 'Zendesk', 'Zoho', 'Postman', 'Razorpay'
];

// Industry keywords for inference
const INDUSTRY_KEYWORDS = {
    'FinTech': ['bank', 'finance', 'payment', 'fintech', 'trading', 'capital', 'investment'],
    'E-Commerce': ['shop', 'commerce', 'retail', 'marketplace', 'store'],
    'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'hospital'],
    'EdTech': ['education', 'learning', 'academy', 'school', 'university'],
    'Enterprise Software': ['enterprise', 'business', 'solutions', 'consulting'],
    'Cloud & Infrastructure': ['cloud', 'aws', 'azure', 'infrastructure', 'devops'],
    'AI/ML': ['ai', 'machine learning', 'data science', 'analytics'],
    'Gaming': ['game', 'gaming', 'esports']
};

/**
 * Categorize company size
 * @param {string} companyName 
 * @returns {string} - 'Enterprise', 'Mid-size', or 'Startup'
 */
export function categorizeCompanySize(companyName) {
    if (!companyName) return 'Startup';

    const normalized = companyName.toLowerCase().trim();

    // Check enterprise list
    if (ENTERPRISE_COMPANIES.some(c => normalized.includes(c.toLowerCase()))) {
        return 'Enterprise';
    }

    // Check mid-size list
    if (MIDSIZE_COMPANIES.some(c => normalized.includes(c.toLowerCase()))) {
        return 'Mid-size';
    }

    // Default to startup for unknown companies
    return 'Startup';
}

/**
 * Infer industry from company name and role
 * @param {string} companyName 
 * @param {string} role 
 * @returns {string} - Industry name
 */
export function inferIndustry(companyName = '', role = '') {
    const searchText = `${companyName} ${role}`.toLowerCase();

    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
        if (keywords.some(keyword => searchText.includes(keyword))) {
            return industry;
        }
    }

    return 'Technology Services';
}

/**
 * Get typical hiring focus based on company size
 * @param {string} companySize 
 * @returns {object} - Hiring focus details
 */
export function getHiringFocus(companySize) {
    const focuses = {
        'Enterprise': {
            primary: 'Structured DSA + Core Fundamentals',
            secondary: 'System design, behavioral, cultural fit',
            emphasis: 'Strong focus on algorithmic problem solving and computer science fundamentals. Expect multiple rigorous coding rounds.'
        },
        'Mid-size': {
            primary: 'Balanced DSA + Practical Skills',
            secondary: 'Project experience, tech stack familiarity',
            emphasis: 'Mix of algorithmic thinking and hands-on development skills. Portfolio and past projects matter.'
        },
        'Startup': {
            primary: 'Practical Problem Solving + Stack Depth',
            secondary: 'Speed of execution, learning ability',
            emphasis: 'Focus on getting things done. Real-world coding ability and tech stack expertise are highly valued.'
        }
    };

    return focuses[companySize] || focuses['Startup'];
}

/**
 * Generate complete company intel
 * @param {string} companyName 
 * @param {string} role 
 * @returns {object} - Complete intel object
 */
export function generateCompanyIntel(companyName, role) {
    const size = categorizeCompanySize(companyName);
    const industry = inferIndustry(companyName, role);
    const hiringFocus = getHiringFocus(size);

    const sizeInfo = {
        'Enterprise': { label: 'Enterprise', range: '2000+ employees', icon: '🏢' },
        'Mid-size': { label: 'Mid-size', range: '200-2000 employees', icon: '🏭' },
        'Startup': { label: 'Startup', range: '<200 employees', icon: '🚀' }
    };

    return {
        companyName: companyName || 'Unknown',
        industry,
        size,
        sizeInfo: sizeInfo[size],
        hiringFocus,
        isDemo: true // Flag for demo mode
    };
}
