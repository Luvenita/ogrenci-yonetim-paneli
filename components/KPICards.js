
import { Users, UserMinus } from 'lucide-react';

export default function KPICards({ students }) {
    const totalStudents = students.length;
    const totalAbsent = students.reduce((acc, curr) => acc + (curr.absentDays || 0), 0);
    const avgAbsent = totalStudents > 0 ? (totalAbsent / totalStudents).toFixed(1) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700 transition-colors">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Toplam Öğrenci</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalStudents}</h3>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full dark:bg-indigo-900/30">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700 transition-colors">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ortalama Devamsızlık</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{avgAbsent} Gün</h3>
                </div>
                <div className="p-3 bg-red-50 rounded-full dark:bg-red-900/30">
                    <UserMinus className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
            </div>
        </div>
    );
}
