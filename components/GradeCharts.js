
'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/components/ThemeProvider';

export default function GradeCharts({ students, courses = [] }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Helper to calculate average with dynamic weights
    const getAverage = (midterm, final, courseName) => {
        const course = courses.find(c => c.name === courseName);
        const midtermWeight = course?.midtermWeight ? course.midtermWeight / 100 : 0.4;
        const finalWeight = course?.finalWeight ? course.finalWeight / 100 : 0.6;
        return (midterm * midtermWeight) + (final * finalWeight);
    };

    // Chart Colors
    const COLORS = ['#16a34a', '#dc2626']; // Pass (Green), Fail (Red)
    const AXIS_COLOR = isDark ? '#94a3b8' : '#64748b'; // Slate-400 : Slate-500
    const GRID_COLOR = isDark ? '#334155' : '#e2e8f0'; // Slate-700 : Slate-200
    const TOOLTIP_STYLE = {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        color: isDark ? '#fff' : '#000'
    };

    // Calculate Pass/Fail
    const passFailData = students.reduce((acc, student) => {
        const { midterm, final, absentDays = 0, course } = student;
        if (midterm === undefined || final === undefined) return acc;

        const avg = getAverage(midterm, final, course);
        const isAbsentFailed = absentDays >= 4;

        if (avg >= 50 && !isAbsentFailed) acc[0].value += 1; // Pass
        else acc[1].value += 1; // Fail

        return acc;
    }, [
        { name: 'Geçen', value: 0 },
        { name: 'Kalan', value: 0 }
    ]);

    // Calculate Grade Distribution
    const gradeDist = {
        'AA': 0, 'BA': 0, 'BB': 0, 'CB': 0, 'CC': 0, 'DC': 0, 'DD': 0, 'FF': 0
    };

    students.forEach(student => {
        const { midterm, final, course } = student;
        if (midterm === undefined || final === undefined) return;

        const avg = getAverage(midterm, final, course);
        let letter = 'FF';
        if (avg >= 90) letter = 'AA';
        else if (avg >= 85) letter = 'BA';
        else if (avg >= 80) letter = 'BB';
        else if (avg >= 75) letter = 'CB';
        else if (avg >= 70) letter = 'CC';
        else if (avg >= 60) letter = 'DC';
        else if (avg >= 50) letter = 'DD';

        gradeDist[letter] += 1;
    });

    const barData = Object.keys(gradeDist).map(key => ({
        name: key,
        count: gradeDist[key]
    }));

    // Hide if no data
    const hasGrades = students.some(s => s.midterm !== undefined && s.final !== undefined);
    if (!hasGrades) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart - Pass/Fail */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 transition-colors">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 dark:text-white">Başarı Durumu</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={passFailData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {passFailData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDark ? '#1e293b' : '#fff'} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: isDark ? '#cbd5e1' : '#1e293b' }} />
                            <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: AXIS_COLOR }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart - Grade Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 transition-colors">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 dark:text-white">Harf Notu Dağılımı</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR }} />
                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR }} />
                            <Tooltip cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }} contentStyle={TOOLTIP_STYLE} />
                            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Öğrenci Sayısı" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
