import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, HelpCircle, RotateCcw, AlertCircle, Ship } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TEST_ITEMS, getChecklist, updateTest, resetChecklist, getProgress } from '../services/checklistService';

export default function TestChecklist() {
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState({});
    const [progress, setProgress] = useState({ passed: 0, total: 10, percentage: 0 });
    const [expandedHints, setExpandedHints] = useState({});

    useEffect(() => {
        loadChecklist();
    }, []);

    const loadChecklist = () => {
        const data = getChecklist();
        setChecklist(data);
        const prog = getProgress();
        setProgress(prog);
    };

    const handleToggle = (testId) => {
        const newValue = !checklist[testId];
        updateTest(testId, newValue);
        loadChecklist();
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all tests? This cannot be undone.')) {
            resetChecklist();
            loadChecklist();
        }
    };

    const toggleHint = (testId) => {
        setExpandedHints(prev => ({
            ...prev,
            [testId]: !prev[testId]
        }));
    };

    const isComplete = progress.passed === progress.total;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-gray-900">Test Checklist</h1>
                    </div>
                    <p className="text-gray-600">Verify all features before shipping</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Checklist
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/prp/08-ship')}>
                        <Ship className="w-4 h-4 mr-2" />
                        Go to Ship
                    </Button>
                </div>
            </div>

            {/* Progress Summary */}
            <Card className={`${isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                Tests Passed: {progress.passed} / {progress.total}
                            </h2>
                            {!isComplete && (
                                <div className="flex items-center gap-2 text-amber-800">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="font-semibold">Fix issues before shipping.</p>
                                </div>
                            )}
                            {isComplete && (
                                <div className="flex items-center gap-2 text-green-800">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <p className="font-semibold">All tests passed! Ready to ship 🚀</p>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <div className={`text-5xl font-bold ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
                                {progress.percentage}%
                            </div>
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mt-1">
                                Complete
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Checklist */}
            <Card>
                <CardHeader>
                    <CardTitle>Verification Tests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {TEST_ITEMS.map((test, index) => {
                            const isChecked = checklist[test.id] || false;
                            const isHintExpanded = expandedHints[test.id] || false;

                            return (
                                <div
                                    key={test.id}
                                    className={`border rounded-lg p-4 transition-all ${isChecked
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            id={test.id}
                                            checked={isChecked}
                                            onChange={() => handleToggle(test.id)}
                                            className="mt-1 w-5 h-5 text-primary rounded border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                                        />

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <label
                                                    htmlFor={test.id}
                                                    className={`font-semibold cursor-pointer ${isChecked ? 'text-green-900' : 'text-gray-900'
                                                        }`}
                                                >
                                                    {index + 1}. {test.label}
                                                </label>
                                                <button
                                                    onClick={() => toggleHint(test.id)}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                    title="Show/hide hint"
                                                >
                                                    <HelpCircle className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Hint (collapsible) */}
                                            {isHintExpanded && (
                                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                                                    <strong>💡 How to test:</strong> {test.hint}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex gap-4 justify-center pb-8">
                <Button variant="secondary" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Tests
                </Button>
                <Button
                    variant={isComplete ? 'primary' : 'secondary'}
                    onClick={() => navigate('/prp/08-ship')}
                >
                    <Ship className="w-4 h-4 mr-2" />
                    {isComplete ? 'Ready to Ship 🚀' : 'Check Ship Status'}
                </Button>
            </div>
        </div>
    );
}
