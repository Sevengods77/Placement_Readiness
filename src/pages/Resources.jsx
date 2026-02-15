export default function Resources() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Structures Guide</h3>
          <p className="text-gray-600 text-sm mb-4">Master essential data structures with comprehensive tutorials.</p>
          <button className="text-primary hover:text-primary-dark font-medium">Read Guide →</button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Tips</h3>
          <p className="text-gray-600 text-sm mb-4">Best practices and strategies for successful interviews.</p>
          <button className="text-primary hover:text-primary-dark font-medium">Read Guide →</button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Database</h3>
          <p className="text-gray-600 text-sm mb-4">Curated information about top companies and their hiring process.</p>
          <button className="text-primary hover:text-primary-dark font-medium">Explore →</button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
          <p className="text-gray-600 text-sm mb-4">Watch expert-led tutorials on various topics.</p>
          <button className="text-primary hover:text-primary-dark font-medium">Watch Now →</button>
        </div>
      </div>
    </div>
  );
}
