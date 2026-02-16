import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Calendar, Building2, Briefcase, TrendingUp, Trash2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getHistory, deleteAnalysis, getCorruptedEntriesCount } from '../services/storageService';

export default function History() {
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState([]);
    const [corruptedCount, setCorruptedCount] = useState(0);
    const [showCorruptedWarning, setShowCorruptedWarning] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const history = getHistory();
        setAnalyses(history);

        // Check for corrupted entries
        const corrupted = getCorruptedEntriesCount();
        setCorruptedCount(corrupted);
        setShowCorruptedWarning(corrupted > 0);
    };

    const handleView = (analysis) => {
        navigate(`/app/results?id=${analysis.id}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this analysis?')) {
            deleteAnalysis(id);
            loadHistory();
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-green-600 bg-green-50';
        if (score >= 50) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <HistoryIcon className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
                    </div>
                    <p className="text-gray-600">View and manage your saved JD analyses</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/app/analyzer')}>
                    <FileText className="w-4 h-4 mr-2" />
                    New Analysis
                </Button>
            </div>

            {/* Corrupted Entries Warning */}
            {showCorruptedWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-900 mb-1">
                                    {corruptedCount === 1 ? 'One entry couldn\'t be loaded' : `${corruptedCount} entries couldn\'t be loaded`}
                                </h3>
                                <p className="text-sm text-amber-800">
                                    Some saved entries were corrupted and have been removed. Create a new analysis to continue.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCorruptedWarning(false)}
                            className="text-amber-600 hover:text-amber-800 transition-colors"
                            title="Dismiss"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* History List */}
            {analyses.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved analyses yet</h3>
                        <p className="text-gray-600 mb-6">
                            Analyze your first job description to get started!
                        </p>
                        <Button variant="primary" onClick={() => navigate('/app/analyzer')}>
                            Analyze a JD
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {analyses.map((analysis) => (
                        <Card
                            key={analysis.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleView(analysis)}
                        >
                            <CardContent className="py-5">
                                <div className="flex items-start justify-between gap-4">
                                    {/* Main Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {analysis.company && (
                                                <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                                    <Building2 className="w-4 h-4 text-primary" />
                                                    <span>{analysis.company}</span>
                                                </div>
                                            )}
                                            {analysis.role && (
                                                <div className="flex items-center gap-1 text-gray-700">
                                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                                    <span>{analysis.role}</span>
                                                </div>
                                            )}
                                            {!analysis.company && !analysis.role && (
                                                <span className="text-gray-600 font-medium">Untitled Analysis</span>
                                            )}
                                        </div>

                                        {/* Date and preview */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(analysis.createdAt)}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-600 truncate max-w-md">
                                                {analysis.jdText.substring(0, 80)}...
                                            </span>
                                        </div>

                                        {/* Skills preview */}
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {Object.entries(analysis.extractedSkills).slice(0, 3).map(([category, skills]) => (
                                                <span
                                                    key={category}
                                                    className="px-2 py-0.5 bg-primary/5 text-primary text-xs font-medium rounded border border-primary/10"
                                                >
                                                    {category}: {skills.length}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Score and Actions */}
                                    <div className="flex items-center gap-3">
                                        <div className={`px-4 py-2 rounded-lg ${getScoreColor(analysis.finalScore || analysis.readinessScore || 0)}`}>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="text-2xl font-bold">{analysis.finalScore || analysis.readinessScore || 0}</span>
                                            </div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider">Score</p>
                                        </div>

                                        <button
                                            onClick={(e) => handleDelete(analysis.id, e)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Stats Summary */}
            {analyses.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-center gap-8 text-center">
                            <div>
                                <p className="text-2xl font-bold text-primary">{analyses.length}</p>
                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                                    Total Analyses
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    {Math.round(
                                        analyses.reduce((sum, a) => sum + (a.finalScore || a.readinessScore || 0), 0) / analyses.length
                                    )}
                                </p>
                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                                    Avg Score
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    {analyses.filter(a => (a.finalScore || a.readinessScore || 0) >= 75).length}
                                </p>
                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                                    High Scores (75+)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
