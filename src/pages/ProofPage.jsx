import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, Clipboard, Check, Award, Package, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    BUILD_STEPS,
    getSteps,
    updateStep,
    getSubmission,
    saveSubmission,
    validateUrl,
    isProjectShipped,
    getCompletionStatus,
    generateSubmissionText
} from '../services/proofService';

export default function ProofPage() {
    const navigate = useNavigate();
    const [steps, setSteps] = useState({});
    const [submission, setSubmission] = useState({ lovableUrl: '', githubUrl: '', deployedUrl: '' });
    const [urlErrors, setUrlErrors] = useState({ lovableUrl: false, githubUrl: false, deployedUrl: false });
    const [isShipped, setIsShipped] = useState(false);
    const [completionStatus, setCompletionStatus] = useState({ steps: false, checklist: false, artifacts: false });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadData();

        // Refresh status when page becomes visible (user returns from test page)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('[PROOF] Page visible, refreshing status...');
                loadData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Auto-save submission when URLs change (with debouncing)
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only save if at least one URL is provided
            if (submission.lovableUrl || submission.githubUrl || submission.deployedUrl) {
                console.log('[PROOF] Auto-saving submission...');
                saveSubmission(submission);
                // Refresh status after save
                const shipped = isProjectShipped();
                setIsShipped(shipped);
                const status = getCompletionStatus();
                setCompletionStatus(status);
            }
        }, 1000); // Save 1 second after user stops typing

        return () => clearTimeout(timer);
    }, [submission]);

    const loadData = () => {
        const stepsData = getSteps();
        setSteps(stepsData);

        const submissionData = getSubmission();
        setSubmission(submissionData);

        const shipped = isProjectShipped();
        setIsShipped(shipped);

        const status = getCompletionStatus();
        setCompletionStatus(status);
    };

    const handleStepToggle = (stepId) => {
        const newValue = !steps[stepId];
        updateStep(stepId, newValue);
        loadData();
    };

    const handleUrlChange = (field, value) => {
        setSubmission(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (urlErrors[field]) {
            setUrlErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const handleSaveSubmission = () => {
        // Validate all URLs
        const errors = {
            lovableUrl: submission.lovableUrl && !validateUrl(submission.lovableUrl),
            githubUrl: submission.githubUrl && !validateUrl(submission.githubUrl),
            deployedUrl: submission.deployedUrl && !validateUrl(submission.deployedUrl)
        };

        setUrlErrors(errors);

        // Only save if no errors
        if (!errors.lovableUrl && !errors.githubUrl && !errors.deployedUrl) {
            saveSubmission(submission);
            loadData();
        }
    };

    const handleCopySubmission = () => {
        const text = generateSubmissionText();
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const completedStepsCount = BUILD_STEPS.filter(step => steps[step.id]).length;

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-gray-900">Project Proof</h1>
                    </div>
                    <p className="text-gray-600">Track your build progress and finalize submission</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Refresh Button */}
                    <Button
                        variant="secondary"
                        onClick={loadData}
                        title="Refresh status"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>

                    {/* Status Badge */}
                    {isShipped ? (
                        <div className="px-6 py-3 bg-green-100 border-2 border-green-300 rounded-lg flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-700" />
                            <span className="text-lg font-bold text-green-800">Shipped</span>
                        </div>
                    ) : (
                        <div className="px-6 py-3 bg-amber-100 border-2 border-amber-300 rounded-lg flex items-center gap-2">
                            <Clock className="w-6 h-6 text-amber-700" />
                            <span className="text-lg font-bold text-amber-800">In Progress</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Completion Message (when shipped) */}
            {isShipped && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                    <CardContent className="py-8">
                        <div className="text-center space-y-4">
                            <Award className="w-16 h-16 text-green-600 mx-auto" />
                            <div className="space-y-2">
                                <p className="text-xl font-bold text-gray-900">
                                    You built a real product.
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    Not a tutorial. Not a clone.
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    A structured tool that solves a real problem.
                                </p>
                                <p className="text-2xl font-bold text-primary mt-4">
                                    This is your proof of work.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Section A: Step Completion Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Build Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm font-semibold mb-2">
                            <span className="text-gray-700">Steps Completed</span>
                            <span className="text-primary">{completedStepsCount} / {BUILD_STEPS.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-primary rounded-full h-3 transition-all duration-300"
                                style={{ width: `${(completedStepsCount / BUILD_STEPS.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Steps List */}
                    <div className="space-y-3">
                        {BUILD_STEPS.map((step, index) => {
                            const isCompleted = steps[step.id] || false;

                            return (
                                <div
                                    key={step.id}
                                    className={`border rounded-lg p-4 transition-all ${isCompleted
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id={step.id}
                                            checked={isCompleted}
                                            onChange={() => handleStepToggle(step.id)}
                                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor={step.id}
                                            className={`flex-1 font-semibold cursor-pointer ${isCompleted ? 'text-green-900' : 'text-gray-900'
                                                }`}
                                        >
                                            {index + 1}. {step.label}
                                        </label>
                                        {isCompleted && (
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Section B: Artifact Inputs */}
            <Card>
                <CardHeader>
                    <CardTitle>Deployment Artifacts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Lovable Project Link */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lovable Project Link *
                            </label>
                            <input
                                type="text"
                                value={submission.lovableUrl}
                                onChange={(e) => handleUrlChange('lovableUrl', e.target.value)}
                                placeholder="https://lovable.dev/projects/..."
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${urlErrors.lovableUrl
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-primary'
                                    }`}
                            />
                            {urlErrors.lovableUrl && (
                                <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Please enter a valid URL starting with http:// or https://</span>
                                </div>
                            )}
                        </div>

                        {/* GitHub Repository Link */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                GitHub Repository Link *
                            </label>
                            <input
                                type="text"
                                value={submission.githubUrl}
                                onChange={(e) => handleUrlChange('githubUrl', e.target.value)}
                                placeholder="https://github.com/username/repo"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${urlErrors.githubUrl
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-primary'
                                    }`}
                            />
                            {urlErrors.githubUrl && (
                                <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Please enter a valid URL starting with http:// or https://</span>
                                </div>
                            )}
                        </div>

                        {/* Deployed URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deployed URL *
                            </label>
                            <input
                                type="text"
                                value={submission.deployedUrl}
                                onChange={(e) => handleUrlChange('deployedUrl', e.target.value)}
                                placeholder="https://your-app.vercel.app"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${urlErrors.deployedUrl
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-primary'
                                    }`}
                            />
                            {urlErrors.deployedUrl && (
                                <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Please enter a valid URL starting with http:// or https://</span>
                                </div>
                            )}
                        </div>

                        <Button variant="primary" onClick={handleSaveSubmission} className="w-full">
                            Save Artifacts (Auto-saves as you type)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Shipped Status Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle>Shipping Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {completionStatus.steps ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                            <span className={completionStatus.steps ? 'text-green-900 font-semibold' : 'text-gray-700'}>
                                All 8 steps completed
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {completionStatus.checklist ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                            <span className={completionStatus.checklist ? 'text-green-900 font-semibold' : 'text-gray-700'}>
                                All 10 tests passed
                            </span>
                            {!completionStatus.checklist && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => navigate('/prp/07-test')}
                                    className="ml-auto"
                                >
                                    Go to Tests
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {completionStatus.artifacts ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                            <span className={completionStatus.artifacts ? 'text-green-900 font-semibold' : 'text-gray-700'}>
                                All 3 artifacts provided
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Export Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Final Submission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        Copy your final submission text to share your work.
                    </p>
                    <Button
                        variant="primary"
                        onClick={handleCopySubmission}
                        className="w-full"
                        disabled={!completionStatus.artifacts}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Clipboard className="w-4 h-4 mr-2" />
                                Copy Final Submission
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
