// Debug test page to verify services work
import { extractSkills } from './services/skillExtractor';
import { generateRoundwiseChecklist, generate7DayPlan, generateInterviewQuestions, calculateReadinessScore } from './services/analysisService';

export default function DebugTest() {
    const testJD = "Need developer with React, Node.js, Python, SQL, AWS skills. Strong DSA required.";

    const handleTest = () => {
        console.log("=== TESTING SKILL EXTRACTION ===");
        const skillData = extractSkills(testJD);
        console.log("Skill Data:", skillData);

        console.log("\n=== TESTING CHECKLIST GENERATION ===");
        const checklist = generateRoundwiseChecklist(skillData.detectedSkills);
        console.log("Checklist:", checklist);

        console.log("\n=== TESTING 7-DAY PLAN ===");
        const plan = generate7DayPlan(skillData.detectedSkills);
        console.log("Plan:", plan);

        console.log("\n=== TESTING QUESTIONS ===");
        const questions = generateInterviewQuestions(skillData.detectedSkills);
        console.log("Questions:", questions);

        console.log("\n=== TESTING SCORE ===");
        const score = calculateReadinessScore({ company: "Google", role: "SDE", jdText: testJD }, skillData);
        console.log("Score:", score);

        alert("Check console for results!");
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Test</h1>
            <button
                onClick={handleTest}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Run Test
            </button>
        </div>
    );
}
