export default function Practice() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Practice Problems</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">Explore and solve coding challenges to sharpen your skills.</p>
        <div className="mt-6 space-y-4">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-gray-900">Arrays & Strings</h3>
            <p className="text-sm text-gray-600">15 problems • Medium difficulty</p>
          </div>
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-gray-900">Dynamic Programming</h3>
            <p className="text-sm text-gray-600">12 problems • Hard difficulty</p>
          </div>
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-gray-900">Graph Algorithms</h3>
            <p className="text-sm text-gray-600">10 problems • Hard difficulty</p>
          </div>
        </div>
      </div>
    </div>
  );
}
