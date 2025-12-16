import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, UserX, TrendingDown, ArrowRight } from 'lucide-react';

export default function RiskAlert({ riskyStudents, onEditStudent }) {
    const [isOpen, setIsOpen] = useState(true);

    if (!riskyStudents || riskyStudents.length === 0) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden mb-6 dark:bg-red-900/10 dark:border-red-900/30">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-100/50 transition-colors dark:hover:bg-red-900/20"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-900 dark:text-red-100">
                            Risk Altındaki Öğrenciler ({riskyStudents.length})
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            Devamsızlık sınırında veya başarısız durumda olan öğrenciler.
                        </p>
                    </div>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-red-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-red-400" />
                )}
            </div>

            {isOpen && (
                <div className="border-t border-red-100 dark:border-red-900/30">
                    <div className="max-h-[300px] overflow-y-auto">
                        {riskyStudents.map((student, index) => (
                            <div
                                key={student.id || index}
                                className="flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/5 border-b border-red-100 last:border-0 dark:border-red-900/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-red-100 text-slate-600 font-bold text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                        {student.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">
                                            {student.name}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <span>{student.course}</span>
                                            <span>•</span>
                                            <span>{student.studentId}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    {/* Risk Reasons */}
                                    <div className="flex gap-4">
                                        {student.isHighAbsent && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full dark:bg-orange-900/30 dark:text-orange-300">
                                                <UserX className="w-3.5 h-3.5" />
                                                {student.absentDays} Gün Devamsızlık
                                            </div>
                                        )}
                                        {student.isFailing && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-100 px-2.5 py-1 rounded-full dark:bg-red-900/30 dark:text-red-300">
                                                <TrendingDown className="w-3.5 h-3.5" />
                                                Ort: {student.avg?.toFixed(1)}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditStudent(student);
                                        }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                                        title="Düzenle"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
