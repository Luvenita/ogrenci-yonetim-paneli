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
                <div className="border-t border-red-100 dark:border-red-900/30 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                        {riskyStudents.map((student, index) => (
                            <div
                                key={student.id || index}
                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-100 hover:shadow-sm transition-shadow dark:bg-slate-800 dark:border-red-900/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-600 font-bold text-xs dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-300">
                                        {student.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium text-sm text-slate-900 truncate dark:text-white">
                                            {student.name}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {student.isHighAbsent && (
                                                <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-900/30">
                                                    {student.absentDays} Gün
                                                </span>
                                            )}
                                            {student.isFailing && (
                                                <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30">
                                                    Ort: {student.avg?.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditStudent(student);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50 transition-colors dark:hover:bg-slate-700 dark:hover:text-indigo-400 shrink-0"
                                    title="Düzenle"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
