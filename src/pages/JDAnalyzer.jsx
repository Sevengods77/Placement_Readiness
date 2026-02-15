import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Building2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { extractSkills } from '../services/skillExtractor';
import { generateRoundwiseChecklist, generate7DayPlan, generateInterviewQuestions, calculateReadinessScore } from '../services/analysisService';
import { saveAnalysis } from '../services/storageService';

export default function JDAnalyzer() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        jdText: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.jdText.trim()) {
            alert('Please enter a job description');
            return;
        }

        console.log("=== STARTING ANALYSIS ===");
        console.log("Form Data:", formData);
        setIsAnalyzing(true);

        // Simulate brief processing delay for UX
        setTimeout(() => {
            try {
                // Extract skills
                console.log("Extracting skills...");
                const skillData = extractSkills(formData.jdText);
                console.log("Skill Data:", skillData);

                // Generate outputs
                console.log("Generating checklist...");
                const checklist = generateRoundwiseChecklist(skillData.detectedSkills);
                console.log("Checklist:", checklist);

                console.log("Generating plan...");
                const plan = generate7DayPlan(skillData.detectedSkills);
                console.log("Plan:", plan);

                console.log("Generating questions...");
                const questions = generateInterviewQuestions(skillData.detectedSkills);
                console.log("Questions:", questions);

                console.log("Calculating score...");
                const score = calculateReadinessScore(formData, skillData);
                console.log("Score:", score);

                // Prepare analysis data
                const analysisData = {
                    company: formData.company,
                    role: formData.role,
                    jdText: formData.jdText,
                    extractedSkills: skillData.detectedSkills,
                    checklist,
                    plan,
                    questions,
                    readinessScore: score
                };

                // AUTO-SAVE to history immediately
                console.log("Auto-saving to history...");
                const savedId = saveAnalysis(analysisData);
                console.log("Saved with ID:", savedId);

                console.log("Navigating to results...");
                // Navigate to results with the saved ID
                navigate(`/app/results?id=${savedId}`);
            } catch (error) {
                console.error("Analysis error:", error);
                alert("Error during analysis: " + error.message);
                setIsAnalyzing(false);
            }
        }, 800);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-gray-900">JD Analyzer</h1>
                </div>
                <p className="text-gray-600">
                    Analyze job descriptions and get personalized preparation plans
                </p>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Enter Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Building2 className="w-4 h-4 inline mr-1" />
                                Company Name <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g., Google, Amazon, Microsoft"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Briefcase className="w-4 h-4 inline mr-1" />
                                Role / Position <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g., SDE Intern, Frontend Developer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        {/* JD Text */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="jdText"
                                value={formData.jdText}
                                onChange={handleChange}
                                placeholder="Paste the job description here... Include requirements, skills, responsibilities, etc."
                                rows={12}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-vertical font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.jdText.length} characters
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-12 text-base"
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-spin mr-2" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Analyze JD
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                    <p className="text-sm text-gray-700">
                        <strong>💡 Tip:</strong> For best results, include the complete job description with
                        required skills, qualifications, and responsibilities. The more detail, the better your personalized plan!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
