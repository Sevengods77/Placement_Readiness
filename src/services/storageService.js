/**
 * Storage Service
 * Handles localStorage persistence for analysis history
 */

const STORAGE_KEY = 'placement_analyses';

/**
 * Generate unique ID
 */
function generateId() {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save analysis to localStorage
 * @param {Object} analysisData - Complete analysis data
 * @returns {string} - Analysis ID
 */
export function saveAnalysis(analysisData) {
    try {
        console.log("[STORAGE] saveAnalysis called with:", analysisData);
        const analyses = getHistory();
        console.log("[STORAGE] Current history count:", analyses.length);

        const entry = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...analysisData
        };

        console.log("[STORAGE] New entry created:", entry);

        analyses.unshift(entry); // Add to beginning
        const jsonString = JSON.stringify(analyses);
        localStorage.setItem(STORAGE_KEY, jsonString);

        // Verify save
        const verify = localStorage.getItem(STORAGE_KEY);
        console.log("[STORAGE] Saved successfully, verification:", verify !== null);
        console.log("[STORAGE] New history count:", analyses.length);

        return entry.id;
    } catch (error) {
        console.error("[STORAGE] Error saving:", error);
        alert("Failed to save: " + error.message);
        throw error;
    }
}

/**
 * Get all saved analyses
 * @returns {Array} - Array of analysis entries
 */
export function getHistory() {
    try {
        console.log("[STORAGE] getHistory called");
        const data = localStorage.getItem(STORAGE_KEY);
        console.log("[STORAGE] Raw data:", data ? `${data.length} chars` : "null");

        if (!data) {
            console.log("[STORAGE] No history found, returning []");
            return [];
        }

        const parsed = JSON.parse(data);
        console.log("[STORAGE] Parsed history, count:", parsed.length);
        return parsed;
    } catch (error) {
        console.error('[STORAGE] Error reading history:', error);
        return [];
    }
}

/**
 * Get specific analysis by ID
 * @param {string} id - Analysis ID
 * @returns {Object|null} - Analysis entry or null
 */
export function getAnalysisById(id) {
    console.log("[STORAGE] getAnalysisById:", id);
    const analyses = getHistory();
    const found = analyses.find(a => a.id === id);
    console.log("[STORAGE] Found:", found !== undefined);
    return found || null;
}

/**
 * Delete analysis by ID
 * @param {string} id - Analysis ID
 * @returns {boolean} - Success status
 */
export function deleteAnalysis(id) {
    try {
        console.log("[STORAGE] deleteAnalysis:", id);
        const analyses = getHistory();
        const filtered = analyses.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        console.log("[STORAGE] Deleted. Before:", analyses.length, "After:", filtered.length);
        return true;
    } catch (error) {
        console.error('[STORAGE] Error deleting analysis:', error);
        return false;
    }
}

/**
 * Clear all history
 */
export function clearHistory() {
    console.log("[STORAGE] clearHistory called");
    localStorage.removeItem(STORAGE_KEY);
}
