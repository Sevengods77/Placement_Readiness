import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, Calendar, HelpCircle, ArrowLeft, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAnalysisById } from '../services/storageService';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState(null);

    useEffect(() => {
        console.log("Results page loaded");
        console.log("Location:", location);

        // Get analysis ID from URL
        const params = new URLSearchParams(location.search);
        const analysisId = params.get('id');

        if (analysisId) {
            console.log("Loading analysis from history:", analysisId);
            const savedAnalysis = getAnalysisById(analysisId);

            if (savedAnalysis) {
                console.log("Found saved analysis:", savedAnalysis);
                setAnalysisData(savedAnalysis);
            } else {
                console.log("No saved analysis found, redirecting");
                alert("Analysis not found!");
                navigate('/app/analyzer');
            }
        } else {
            // No ID provided, redirect to analyzer
            console.log("No analysis ID provided, redirecting to analyzer");
            navigate('/app/analyzer');
        }
    }, [location, navigate]);

    if (!analysisData) {
        return <div className="text-center py-20">Loading...</div>;
    }

    const { company, role, extractedSkills, readinessScore, checklist, plan, questions } = analysisData;

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
                        <CircularProgress score={readinessScore} />
                        <div className="text-center">
                            <Award className="w-12 h-12 text-primary mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-900">Your Readiness Score</h3>
                            <p className="text-gray-600 mt-1">Based on JD analysis and skill match</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Extracted Skills */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Tag className="w-5 h-5 inline mr-2" />
                        Detected Skills
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(extractedSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h4 className="text-sm font-bold text-gray-700 mb-2">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
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
            <Card>
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

// Circular Progress Component (similar to Dashboard)
function CircularProgress({ score }) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const size = 160;
    const radius = 60;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedScore / 100) * circumference;

    // Color based on score
    const getColor = () => {
        if (clampedScore >= 75) return '#10b981'; // green
        if (clampedScore >= 50) return '#f59e0b'; // orange
        return '#ef4444'; // red
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
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <p className="text-5xl font-bold" style={{ color: getColor() }}>{clampedScore}</p>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mt-1">Score</p>
            </div>
        </div>
    );
}
