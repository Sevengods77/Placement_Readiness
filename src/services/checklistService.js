/**
 * Checklist Service
 * Manages test checklist state in localStorage
 */

const CHECKLIST_KEY = 'prp_test_checklist';

/**
 * Test definitions
 */
export const TEST_ITEMS = [
    {
        id: 'jd-required',
        label: 'JD required validation works',
        hint: 'Try submitting empty JD on the analyzer page - should show HTML5 validation'
    },
    {
        id: 'short-jd-warning',
        label: 'Short JD warning shows for <200 chars',
        hint: 'Type less than 200 characters in JD field - amber warning should appear'
    },
    {
        id: 'skills-extraction',
        label: 'Skills extraction groups correctly',
        hint: 'Submit JD with various tech skills (React, Java, AWS) - check they appear in correct categories'
    },
    {
        id: 'round-mapping',
        label: 'Round mapping changes based on company + skills',
        hint: 'Compare results for different company types - round structure should vary'
    },
    {
        id: 'score-deterministic',
        label: 'Score calculation is deterministic',
        hint: 'Submit same JD twice - base score should be identical'
    },
    {
        id: 'skill-toggles',
        label: 'Skill toggles update score live',
        hint: 'Click skills on results page - score should change by ±2 immediately'
    },
    {
        id: 'persist-refresh',
        label: 'Changes persist after refresh',
        hint: 'Toggle skills, refresh page (F5) - changes should remain'
    },
    {
        id: 'history-save-load',
        label: 'History saves and loads correctly',
        hint: 'Create analysis, navigate to history - entry should appear with correct data'
    },
    {
        id: 'export-buttons',
        label: 'Export buttons copy the correct content',
        hint: 'Click export buttons on results page, paste in notepad - content should be correct'
    },
    {
        id: 'no-console-errors',
        label: 'No console errors on core pages',
        hint: 'Open DevTools console, navigate through app - no red errors should appear'
    }
];

/**
 * Get checklist state from localStorage
 * @returns {Object} - Map of testId -> boolean
 */
export function getChecklist() {
    try {
        const data = localStorage.getItem(CHECKLIST_KEY);
        if (!data) {
            // Initialize with all tests unchecked
            const initialState = {};
            TEST_ITEMS.forEach(test => {
                initialState[test.id] = false;
            });
            return initialState;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('[CHECKLIST] Error reading checklist:', error);
        const initialState = {};
        TEST_ITEMS.forEach(test => {
            initialState[test.id] = false;
        });
        return initialState;
    }
}

/**
 * Update a single test state
 * @param {string} testId - Test ID
 * @param {boolean} value - Checked state
 */
export function updateTest(testId, value) {
    try {
        const checklist = getChecklist();
        checklist[testId] = value;
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
        console.log(`[CHECKLIST] Updated ${testId} to ${value}`);
    } catch (error) {
        console.error('[CHECKLIST] Error updating test:', error);
    }
}

/**
 * Reset checklist (uncheck all tests)
 */
export function resetChecklist() {
    try {
        const resetState = {};
        TEST_ITEMS.forEach(test => {
            resetState[test.id] = false;
        });
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(resetState));
        console.log('[CHECKLIST] Reset all tests');
    } catch (error) {
        console.error('[CHECKLIST] Error resetting checklist:', error);
    }
}

/**
 * Check if all tests are passed
 * @returns {boolean} - True if all 10 tests are checked
 */
export function isComplete() {
    const checklist = getChecklist();
    return TEST_ITEMS.every(test => checklist[test.id] === true);
}

/**
 * Get progress information
 * @returns {Object} - { passed: number, total: number, percentage: number }
 */
export function getProgress() {
    const checklist = getChecklist();
    const passed = TEST_ITEMS.filter(test => checklist[test.id] === true).length;
    const total = TEST_ITEMS.length;
    const percentage = Math.round((passed / total) * 100);

    return {
        passed,
        total,
        percentage
    };
}
