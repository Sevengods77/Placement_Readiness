import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

function TestChart() {
    const data = [
        { name: 'A', value: 75 },
        { name: 'B', value: 60 },
        { name: 'C', value: 80 },
    ];

    return (
        <div style={{ width: '100%', height: '400px', background: '#f0f0f0' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TestChart;
