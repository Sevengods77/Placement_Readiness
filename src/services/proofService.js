/**
 * Proof Service
 * Manages project completion tracking and final submission
 */

import { isComplete as checklistIsComplete } from './checklistService.js';

const STEPS_KEY = 'prp_steps_completion';
const SUBMISSION_KEY = 'prp_final_submission';

/**
 * 8 Build Steps
 */
export const BUILD_STEPS = [
    { id: 'step1', label: 'Design System Setup', key: 'design' },
    { id: 'step2', label: 'JD Analyzer Built', key: 'analyzer' },
    { id: 'step3', label: 'Results Page Complete', key: 'results' },
    { id: 'step4', label: 'History System Working', key: 'history' },
    { id: 'step5', label: 'Data Validation Hardened', key: 'validation' },
    { id: 'step6', label: 'Company Intel Added', key: 'intel' },
    { id: 'step7', label: 'Round Mapping Implemented', key: 'rounds' },
    { id: 'step8', label: 'Test Checklist System', key: 'tests' }
];

/**
 * Get steps completion state
 * @returns {Object} - Map of stepId -> boolean
 */
export function getSteps() {
    try {
        const data = localStorage.getItem(STEPS_KEY);
        if (!data) {
            // Initialize all steps as incomplete
            const initialState = {};
            BUILD_STEPS.forEach(step => {
                initialState[step.id] = false;
            });
            return initialState;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('[PROOF] Error reading steps:', error);
        const initialState = {};
        BUILD_STEPS.forEach(step => {
            initialState[step.id] = false;
        });
        return initialState;
    }
}

/**
 * Update a single step completion status
 * @param {string} stepId - Step ID
 * @param {boolean} completed - Completion state
 */
export function updateStep(stepId, completed) {
    try {
        const steps = getSteps();
        steps[stepId] = completed;
        localStorage.setItem(STEPS_KEY, JSON.stringify(steps));
        console.log(`[PROOF] Updated ${stepId} to ${completed}`);
    } catch (error) {
        console.error('[PROOF] Error updating step:', error);
    }
}

/**
 * Get submission artifacts
 * @returns {Object} - { lovableUrl, githubUrl, deployedUrl }
 */
export function getSubmission() {
    try {
        const data = localStorage.getItem(SUBMISSION_KEY);
        if (!data) {
            return {
                lovableUrl: '',
                githubUrl: '',
                deployedUrl: ''
            };
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('[PROOF] Error reading submission:', error);
        return {
            lovableUrl: '',
            githubUrl: '',
            deployedUrl: ''
        };
    }
}

/**
 * Save submission artifacts
 * @param {Object} submission - { lovableUrl, githubUrl, deployedUrl }
 */
export function saveSubmission(submission) {
    try {
        localStorage.setItem(SUBMISSION_KEY, JSON.stringify(submission));
        console.log('[PROOF] Saved submission:', submission);
    } catch (error) {
        console.error('[PROOF] Error saving submission:', error);
    }
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function validateUrl(url) {
    if (!url || typeof url !== 'string') return false;

    // Must start with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
    }

    // Basic URL pattern validation
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Check if all steps are completed
 * @returns {boolean}
 */
export function allStepsComplete() {
    const steps = getSteps();
    return BUILD_STEPS.every(step => steps[step.id] === true);
}

/**
 * Check if all artifacts are provided and valid
 * @returns {boolean}
 */
export function allArtifactsProvided() {
    const { lovableUrl, githubUrl, deployedUrl } = getSubmission();
    return validateUrl(lovableUrl) && validateUrl(githubUrl) && validateUrl(deployedUrl);
}

/**
 * Check if project is shipped (all conditions met)
 * @returns {boolean}
 */
export function isProjectShipped() {
    const stepsComplete = allStepsComplete();
    const checklistComplete = checklistIsComplete();
    const artifactsComplete = allArtifactsProvided();

    console.log('[PROOF] Shipped status check:', {
        stepsComplete,
        checklistComplete,
        artifactsComplete
    });

    return stepsComplete && checklistComplete && artifactsComplete;
}

/**
 * Get completion progress
 * @returns {Object} - { steps, checklist, artifacts }
 */
export function getCompletionStatus() {
    return {
        steps: allStepsComplete(),
        checklist: checklistIsComplete(),
        artifacts: allArtifactsProvided()
    };
}

/**
 * Generate formatted submission text
 * @returns {string}
 */
export function generateSubmissionText() {
    const { lovableUrl, githubUrl, deployedUrl } = getSubmission();

    return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${lovableUrl || '[Not provided]'}
GitHub Repository: ${githubUrl || '[Not provided]'}
Live Deployment: ${deployedUrl || '[Not provided]'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
}
