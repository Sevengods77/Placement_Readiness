import { AlertCircle, Clock, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

// Circular Progress Component
function CircularProgress({ score }) {
  // Clamping score between 0 and 100
  const clampedScore = Math.min(100, Math.max(0, score));
  const percentage = clampedScore;
  const size = 180; // Slightly smaller to fit better
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center w-full py-2">
      <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 absolute inset-0"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(245, 58%, 51%)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>

        {/* Text overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <p className="text-4xl font-bold text-gray-900 leading-none">{clampedScore}</p>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-2">Readiness Score</p>
        </div>
      </div>
    </div>
  );
}

// Skill Breakdown with Radar Chart
function SkillBreakdown() {
  const data = [
    { name: 'DSA', value: 75 },
    { name: 'System Design', value: 60 },
    { name: 'Communication', value: 80 },
    { name: 'Resume', value: 85 },
    { name: 'Aptitude', value: 70 },
  ];

  console.log('SkillBreakdown rendering, data:', data);

  return (
    <div style={{ width: '100%', height: '300px' }} className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="hsl(245, 58%, 51%)"
            fill="hsl(245, 58%, 51%)"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const progress = 3;
  const total = 10;
  const isCompleted = progress >= total;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your placement readiness and progress</p>
      </div>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-8">
          {/* Overall Readiness */}
          <Card className="min-h-[420px] flex flex-col">
            <CardHeader>
              <CardTitle>Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <CircularProgress score={72} />
            </CardContent>
          </Card>

          {/* Continue Practice */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-lg font-semibold text-gray-900">Dynamic Programming</p>
                    <p className="text-sm text-gray-600 font-medium">{progress} of {total} completed</p>
                  </div>

                  {isCompleted ? (
                    <div className="py-2 px-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 mb-2">
                      🎉 All topics complete! Great job.
                    </div>
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(progress / total) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <Button variant="primary" className="w-full h-11" disabled={isCompleted}>
                  {isCompleted ? 'Completed' : 'Continue'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skill Breakdown */}
          <Card className="min-h-[420px]">
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillBreakdown />
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-gray-700">Problems Solved: 12/20 this week</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                    const isActive = [0, 1, 2, 4, 5].includes(idx); // Mock active days
                    return (
                      <div key={day} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                          {day[0]}
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'DSA Mock Test', detail: 'Tomorrow, 10:00 AM', icon: Zap },
              { title: 'System Design Review', detail: 'Wed, 2:00 PM', icon: AlertCircle },
              { title: 'HR Interview Prep', detail: 'Friday, 11:00 AM', icon: Clock },
            ].map((assessment, idx) => {
              const Icon = assessment.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-all">
                    <Icon className="w-5 h-5 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{assessment.title}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">{assessment.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
