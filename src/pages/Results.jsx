import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, Calendar, HelpCircle, ArrowLeft, Tag, Copy, Download, Target, Check, AlertCircle, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAnalysisById, updateAnalysis } from '../services/storageService';
import { getRoundTypeColor } from '../services/roundMappingService';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState(null);
    const [skillConfidence, setSkillConfidence] = useState({});
    const [adjustedScore, setAdjustedScore] = useState(0);
    const [analysisId, setAnalysisId] = useState(null);

    useEffect(() => {
        console.log("Results page loaded");

        const params = new URLSearchParams(location.search);
        const id = params.get('id');

        if (id) {
            console.log("Loading analysis:", id);
            const saved = getAnalysisById(id);

            if (saved) {
                console.log("Found analysis:", saved);
                setAnalysisData(saved);
                setAnalysisId(id);

                // Initialize or restore confidence map
                const confidenceMap = saved.skillConfidenceMap || {};
                setSkillConfidence(confidenceMap);

                // Calculate adjusted score
                const base = saved.baseReadinessScore || saved.readinessScore;
                const adjusted = calculateScore(base, confidenceMap);
                setAdjustedScore(adjusted);
            } else {
                alert("Analysis not found!");
                navigate('/app/analyzer');
            }
        } else {
            navigate('/app/analyzer');
        }
    }, [location, navigate]);

    const calculateScore = (baseScore, confidenceMap) => {
        const knowCount = Object.values(confidenceMap).filter(v => v === 'know').length;
        const practiceCount = Object.values(confidenceMap).filter(v => v === 'practice').length;
        const score = baseScore + (knowCount * 2) - (practiceCount * 2);
        return Math.max(0, Math.min(100, score));
    };

    const handleSkillToggle = (skill) => {
        const newConfidence = {
            ...skillConfidence,
            [skill]: skillConfidence[skill] === 'know' ? 'practice' : 'know'
        };

        setSkillConfidence(newConfidence);

        const base = analysisData.baseReadinessScore || analysisData.readinessScore;
        const newScore = calculateScore(base, newConfidence);
        setAdjustedScore(newScore);

        // Save to localStorage
        updateAnalysis(analysisId, {
            skillConfidenceMap: newConfidence,
            readinessScore: newScore
        });
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${label} copied to clipboard!`);
        });
    };

    const formatPlan = () => {
        if (!analysisData) return '';
        return analysisData.plan.map(day =>
            `Day ${day.day}: ${day.title}\n${day.tasks.map(t => `  • ${t}`).join('\n')}`
        ).join('\n\n');
    };

    const formatChecklist = () => {
        if (!analysisData) return '';
        return analysisData.checklist.map(round =>
            `Round ${round.round}: ${round.title}\n${round.items.map(i => `  ✓ ${i}`).join('\n')}`
        ).join('\n\n');
    };

    const formatQuestions = () => {
        if (!analysisData) return '';
        return analysisData.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    };

    const downloadTXT = () => {
        if (!analysisData) return;

        const content = `
JOB DESCRIPTION ANALYSIS REPORT
================================
Company: ${analysisData.company || 'N/A'}
Role: ${analysisData.role || 'N/A'}
Readiness Score: ${adjustedScore}/100

DETECTED SKILLS
===============
${Object.entries(analysisData.extractedSkills).map(([cat, skills]) =>
            `${cat}:\n${skills.map(s => `  • ${s} [${skillConfidence[s] === 'know' ? 'I know this' : 'Need practice'}]`).join('\n')}`
        ).join('\n\n')}

7-DAY STUDY PLAN
================
${formatPlan()}

ROUND-WISE PREPARATION CHECKLIST
=================================
${formatChecklist()}

10 LIKELY INTERVIEW QUESTIONS
==============================
${formatQuestions()}
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis_${analysisData.company || 'report'}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getWeakSkills = () => {
        if (!skillConfidence) return [];
        return Object.entries(skillConfidence)
            .filter(([_, conf]) => conf === 'practice')
            .map(([skill]) => skill)
            .slice(0, 3);
    };

    if (!analysisData) {
        return <div className="text-center py-20">Loading...</div>;
    }

    const { company, role, extractedSkills, checklist, plan, questions } = analysisData;
    const weakSkills = getWeakSkills();

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button
                            onClick={() => navigate('/app/analyzer')}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
                    </div>
                    {company && <p className="text-gray-600">{company} {role && `- ${role}`}</p>}
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate('/app/history')}>
                        View All History
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/app/analyzer')}>
                        New Analysis
                    </Button>
                </div>
            </div>

            {/* Readiness Score */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="py-8">
                    <div className="flex items-center justify-center gap-8">
                        <CircularProgress score={adjustedScore} />
                        <div className="text-center">
                            <Award className="w-12 h-12 text-primary mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-900">Your Readiness Score</h3>
                            <p className="text-gray-600 mt-1">Live score based on skill assessment</p>
                            <p className="text-xs text-gray-500 mt-2">+2 per "know" • -2 per "practice"</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Intel */}
            {analysisData.companyIntel && (
                <Card className="border-indigo-100 bg-white">
                    <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                                Company Intelligence
                            </CardTitle>
                            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                                🤖 Heuristic Mode
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Company Header */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl">
                                {analysisData.companyIntel.sizeInfo.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">{analysisData.companyIntel.companyName}</h3>
                                <p className="text-sm text-gray-600 mt-0.5">{analysisData.companyIntel.industry}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                        {analysisData.companyIntel.sizeInfo.label}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {analysisData.companyIntel.sizeInfo.range}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hiring Focus */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Hiring Focus</h4>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
                                    <p className="text-xs font-semibold text-indigo-600 mb-2">PRIMARY</p>
                                    <p className="font-bold text-gray-900">{analysisData.companyIntel.hiringFocus.primary}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
                                    <p className="text-xs font-semibold text-purple-600 mb-2">SECONDARY</p>
                                    <p className="text-sm text-gray-800">{analysisData.companyIntel.hiringFocus.secondary}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                                <div className="flex gap-3">
                                    <span className="text-2xl">💡</span>
                                    <div>
                                        <p className="text-xs font-bold text-blue-900 mb-1">KEY INSIGHT</p>
                                        <p className="text-sm text-blue-800 leading-relaxed">{analysisData.companyIntel.hiringFocus.emphasis}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Round Mapping Timeline */}
            {analysisData.roundMapping && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                    <CardHeader>
                        <CardTitle>
                            <Target className="w-5 h-5 inline mr-2" />
                            Expected Interview Rounds
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            Typical process for {analysisData.companyIntel?.sizeInfo.label} companies
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analysisData.roundMapping.map((round, index) => (
                                <div key={round.number} className="relative">
                                    {/* Timeline connector */}
                                    {index !== analysisData.roundMapping.length - 1 && (
                                        <div className="absolute left-6 top-14 w-0.5 h-full bg-purple-200" />
                                    )}

                                    <div className="flex gap-4">
                                        {/* Round number badge */}
                                        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                                            {round.number}
                                        </div>

                                        {/* Round content */}
                                        <div className="flex-1 bg-white rounded-lg border border-purple-200 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{round.title}</h4>
                                                    <p className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-1 border ${getRoundTypeColor(round.type)}`}>
                                                        {round.type.toUpperCase()}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {round.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-purple-700 mb-2">
                                                Focus: {round.focus}
                                            </p>
                                            <div className="mt-3 p-3 bg-purple-50 rounded border border-purple-100">
                                                <p className="text-xs font-bold text-purple-900 mb-1">📌 Why This Round Matters</p>
                                                <p className="text-sm text-purple-800 leading-relaxed">{round.whyItMatters}</p>
                                            </div>
                                            <div className="mt-3">
                                                <p className="text-xs font-semibold text-gray-700 mb-1">✅ Quick Tips:</p>
                                                <ul className="space-y-1">
                                                    {round.tips.map((tip, idx) => (
                                                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                                            <span className="text-purple-500 mt-0.5">•</span>
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Interactive Skills */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Tag className="w-5 h-5 inline mr-2" />
                        Detected Skills - Self Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(extractedSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h4 className="text-sm font-bold text-gray-700 mb-2">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, idx) => {
                                        const isKnown = skillConfidence[skill] === 'know';
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleSkillToggle(skill)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${isKnown
                                                    ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100'
                                                    }`}
                                            >
                                                {isKnown ? (
                                                    <>
                                                        <Check className="w-3 h-3 inline mr-1" />
                                                        {skill}
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-3 h-3 inline mr-1" />
                                                        {skill}
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <strong>💡 Tip:</strong> Click each skill to toggle between "I know this" (green ✓) and "Need practice" (orange ⚠).
                            Your readiness score updates automatically!
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Export Tools */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Download className="w-5 h-5 inline mr-2" />
                        Export Tools
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Save your analysis in different formats</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => copyToClipboard(formatPlan(), '7-Day Plan')}
                            className="flex flex-col items-center justify-center gap-2 py-5 h-auto"
                        >
                            <Copy className="w-5 h-5" />
                            <span className="font-semibold">Copy Plan</span>
                            <span className="text-xs text-gray-500">7-day study plan</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => copyToClipboard(formatChecklist(), 'Checklist')}
                            className="flex flex-col items-center justify-center gap-2 py-5 h-auto"
                        >
                            <Copy className="w-5 h-5" />
                            <span className="font-semibold">Copy Checklist</span>
                            <span className="text-xs text-gray-500">Round-wise prep</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => copyToClipboard(formatQuestions(), 'Questions')}
                            className="flex flex-col items-center justify-center gap-2 py-5 h-auto"
                        >
                            <Copy className="w-5 h-5" />
                            <span className="font-semibold">Copy Questions</span>
                            <span className="text-xs text-gray-500">10 likely questions</span>
                        </Button>
                        <Button
                            variant="primary"
                            onClick={downloadTXT}
                            className="flex flex-col items-center justify-center gap-2 py-5 h-auto"
                        >
                            <Download className="w-5 h-5" />
                            <span className="font-semibold">Download TXT</span>
                            <span className="text-xs text-white/80">Complete report</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Round-wise Checklist */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <CheckCircle2 className="w-5 h-5 inline mr-2" />
                        Round-wise Preparation Checklist
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {checklist.map((round) => (
                            <div key={round.round} className="border border-gray-200 rounded-lg p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Round {round.round}: {round.title}
                                </h3>
                                <ul className="space-y-2">
                                    {round.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                                            <span className="text-primary mt-1">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 7-Day Plan */}
            <Card id="day-1-plan">
                <CardHeader>
                    <CardTitle>
                        <Calendar className="w-5 h-5 inline mr-2" />
                        7-Day Study Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {plan.map((day) => (
                            <div key={day.day} className="flex gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary">D{day.day}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{day.title}</h4>
                                    <ul className="space-y-1">
                                        {day.tasks.map((task, idx) => (
                                            <li key={idx} className="text-sm text-gray-700">• {task}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Interview Questions */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <HelpCircle className="w-5 h-5 inline mr-2" />
                        10 Likely Interview Questions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-3">
                        {questions.map((question, idx) => (
                            <li key={idx} className="flex gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                    {idx + 1}
                                </span>
                                <p className="text-gray-800 pt-1">{question}</p>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            {/* Action Next Box */}
            {weakSkills.length > 0 && (
                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                        <CardTitle className="text-amber-900">
                            <Target className="w-5 h-5 inline mr-2" />
                            Action Next
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-amber-900 mb-2">Top Skills to Practice:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {weakSkills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full border border-amber-300">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2 border-t border-amber-200">
                                <p className="text-amber-900 font-medium mb-2">🎯 Suggested Action:</p>
                                <p className="text-amber-800">Start with <a href="#day-1-plan" className="underline font-semibold hover:text-amber-900">Day 1 of your study plan</a> to build momentum!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bottom Actions */}
            <div className="flex gap-4 justify-center pb-8">
                <Button variant="secondary" onClick={() => navigate('/app/analyzer')}>
                    Analyze Another JD
                </Button>
                <Button variant="secondary" onClick={() => navigate('/app/history')}>
                    View History
                </Button>
            </div>
        </div>
    );
}

// Circular Progress Component
function CircularProgress({ score }) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const size = 160;
    const radius = 60;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedScore / 100) * circumference;

    const getColor = () => {
        if (clampedScore >= 75) return '#10b981';
        if (clampedScore >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <p className="text-5xl font-bold" style={{ color: getColor() }}>{clampedScore}</p>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mt-1">Score</p>
            </div>
        </div>
    );
}
