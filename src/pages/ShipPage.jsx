import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Ship, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { isComplete, getProgress } from '../services/checklistService';

export default function ShipPage() {
    const navigate = useNavigate();
    const [complete, setComplete] = useState(false);
    const [progress, setProgress] = useState({ passed: 0, total: 10, percentage: 0 });

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = () => {
        const status = isComplete();
        setComplete(status);
        const prog = getProgress();
        setProgress(prog);
    };

    if (!complete) {
        // LOCKED STATE
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <Card className="max-w-2xl w-full border-red-200 bg-white">
                    <CardContent className="py-12">
                        <div className="text-center space-y-6">
                            {/* Lock Icon */}
                            <div className="flex justify-center">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                                    <Lock className="w-12 h-12 text-red-600" />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Ship is Locked
                                </h1>
                                <p className="text-lg text-gray-600">
                                    All tests must pass before shipping
                                </p>
                            </div>

                            {/* Progress */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="text-4xl font-bold text-amber-600">
                                        {progress.passed} / {progress.total}
                                    </span>
                                </div>
                                <p className="text-sm text-amber-800 font-semibold">
                                    Tests passed • {progress.total - progress.passed} remaining
                                </p>
                            </div>

                            {/* Action Button */}
                            <Button
                                variant="primary"
                                className="w-full max-w-md mx-auto h-12 text-base"
                                onClick={() => navigate('/prp/07-test')}
                            >
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Go to Test Checklist
                            </Button>

                            {/* Help Text */}
                            <p className="text-sm text-gray-500">
                                Complete all verification tests to unlock shipping
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // UNLOCKED STATE
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <Card className="max-w-2xl w-full border-green-200 bg-white">
                <CardContent className="py-12">
                    <div className="text-center space-y-6">
                        {/* Success Icon */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                <Ship className="w-12 h-12 text-green-600" />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Ready to Ship! 🚀
                            </h1>
                            <p className="text-lg text-gray-600">
                                All tests passed successfully
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                <span className="text-4xl font-bold text-green-600">
                                    {progress.passed} / {progress.total}
                                </span>
                            </div>
                            <p className="text-sm text-green-800 font-semibold">
                                All verification tests completed
                            </p>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                            <h3 className="font-bold text-blue-900 mb-3">✅ Verified Features:</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Input validation and error handling</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Data extraction and categorization</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Score calculation and persistence</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>State management and data integrity</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>Export functionality and user experience</span>
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/prp/07-test')}
                            >
                                View Test Checklist
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/app/analyzer')}
                            >
                                <Ship className="w-4 h-4 mr-2" />
                                Start Using App
                            </Button>
                        </div>

                        {/* Footer */}
                        <p className="text-sm text-gray-500">
                            The Placement Readiness Platform is ready for production use
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
