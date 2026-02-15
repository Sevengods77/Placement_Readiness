export default function Assessments() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Assessments</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">Take mock assessments to evaluate your readiness.</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Full-Stack Interview</h3>
              <p className="text-sm text-gray-600">90 minutes • 5 questions</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Start</button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Technical Coding Round</h3>
              <p className="text-sm text-gray-600">120 minutes • 2 problems</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Start</button>
          </div>
        </div>
      </div>
    </div>
  );
}
