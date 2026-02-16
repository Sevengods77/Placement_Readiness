/**
 * Schema Validator Service
 * Validates and migrates analysis entries to ensure data consistency
 */

/**
 * Standard analysis entry schema
 */
export const ANALYSIS_SCHEMA = {
    id: '',
    createdAt: '',
    updatedAt: '',
    company: '',
    role: '',
    jdText: '',
    extractedSkills: {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    },
    roundMapping: [],
    checklist: [],
    plan7Days: [],
    questions: [],
    baseScore: 0,
    skillConfidenceMap: {},
    finalScore: 0
};

/**
 * Validate if an entry has the basic required structure
 * @param {Object} entry - Entry to validate
 * @returns {boolean} - True if entry has minimum required fields
 */
export function isValidEntry(entry) {
    if (!entry || typeof entry !== 'object') {
        return false;
    }

    // Check critical fields
    if (!entry.id || !entry.jdText) {
        return false;
    }

    // Check that extractedSkills is an object
    if (!entry.extractedSkills || typeof entry.extractedSkills !== 'object') {
        return false;
    }

    return true;
}

/**
 * Migrate old schema entries to new standardized schema
 * @param {Object} entry - Old entry to migrate
 * @returns {Object} - Migrated entry
 */
export function migrateAnalysisEntry(entry) {
    const migrated = { ...entry };

    // Add missing timestamps
    if (!migrated.createdAt) {
        migrated.createdAt = new Date().toISOString();
    }
    if (!migrated.updatedAt) {
        migrated.updatedAt = migrated.createdAt;
    }

    // Ensure string fields have defaults
    migrated.company = migrated.company || '';
    migrated.role = migrated.role || '';
    migrated.jdText = migrated.jdText || '';

    // Standardize extractedSkills structure
    const oldSkills = migrated.extractedSkills || {};
    migrated.extractedSkills = {
        coreCS: oldSkills['Core CS'] || oldSkills.coreCS || [],
        languages: oldSkills['Languages'] || oldSkills.languages || [],
        web: oldSkills['Web'] || oldSkills.web || [],
        data: oldSkills['Data'] || oldSkills.data || [],
        cloud: oldSkills['Cloud/DevOps'] || oldSkills.cloud || [],
        testing: oldSkills['Testing'] || oldSkills.testing || [],
        other: oldSkills['General'] || oldSkills.other || []
    };

    // Ensure arrays exist
    migrated.roundMapping = migrated.roundMapping || [];
    migrated.checklist = migrated.checklist || [];
    migrated.plan7Days = migrated.plan || migrated.plan7Days || [];
    migrated.questions = migrated.questions || [];

    // Handle score migration
    // Old entries might have 'readinessScore', new entries have baseScore and finalScore
    if (migrated.baseScore === undefined || migrated.baseScore === null) {
        migrated.baseScore = migrated.readinessScore || migrated.baseReadinessScore || 0;
    }
    if (migrated.finalScore === undefined || migrated.finalScore === null) {
        migrated.finalScore = migrated.readinessScore || migrated.baseScore || 0;
    }

    // Ensure skillConfidenceMap exists
    migrated.skillConfidenceMap = migrated.skillConfidenceMap || {};

    // Remove old field names to avoid confusion
    delete migrated.plan;
    delete migrated.readinessScore;
    delete migrated.baseReadinessScore;

    return migrated;
}

/**
 * Validate and fill missing fields in an analysis entry
 * @param {Object} entry - Entry to validate
 * @returns {Object} - Validated entry with all required fields
 */
export function validateAnalysisEntry(entry) {
    if (!isValidEntry(entry)) {
        throw new Error('Invalid analysis entry: missing required fields (id, jdText, extractedSkills)');
    }

    // Migrate to ensure all fields are present
    const validated = migrateAnalysisEntry(entry);

    return validated;
}

/**
 * Get all skill categories from schema
 * @returns {string[]} - Array of skill category keys
 */
export function getSkillCategories() {
    return Object.keys(ANALYSIS_SCHEMA.extractedSkills);
}

/**
 * Create empty skills object with all categories
 * @returns {Object} - Empty skills object
 */
export function createEmptySkillsObject() {
    return {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };
}
