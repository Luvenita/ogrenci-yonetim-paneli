import { useState, useEffect } from 'react';
import { X, Save, BookOpen, GraduationCap, Calendar, StickyNote } from 'lucide-react';

export default function StudentDetailModal({ isOpen, onClose, student, onSaveNote }) {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (student) {
            setNote(student.privateNotes || '');
        }
    }, [student]);

    if (!isOpen || !student) return null;

    const handleSave = async () => {
        setIsSaving(true);
        await onSaveNote(student.id, note);
        setIsSaving(false);
    };

    const getStatusColor = (avg) => {
        if (avg >= 60) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
        if (avg >= 50) return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    };

    const calculateAvg = () => {
        // Assuming weights are handled in parent or we can recalculated here if we have course info.
        // For simplicity in display, we use the passed avg if available, or simple calc
        // But page.js export logic does complex calc. 
        // Let's just use what's passed if possible, otherwise simple fallback. 
        // Actually page.js doesn't store computed average in DB usually (except for export logic which computes on fly).
        // We might need to receive the computed average or compute it again.
        // For now, let's display raw midterm/final.
        return (student.midterm * 0.4 + student.final * 0.6).toFixed(1); // Fallback standard weight for display
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200 dark:bg-slate-800">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Profile */}
                <div className="p-8 pb-0 text-center">
                    <div className="w-24 h-24 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white shadow-lg dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-slate-700">
                        {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h2>
                    <p className="text-slate-500 font-medium dark:text-slate-400">{student.studentId}</p>
                </div>

                {/* Stats Grid */}
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-700/50 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm dark:text-slate-400">
                                <BookOpen className="w-4 h-4" />
                                Ders
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white truncate" title={student.course}>
                                {student.course}
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-700/50 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                Devamsızlık
                            </div>
                            <div className={`font-semibold ${student.absentDays > 3 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                {student.absentDays} Gün
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-700/50 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm dark:text-slate-400">
                                <GraduationCap className="w-4 h-4" />
                                Vize / Final
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                                {student.midterm} / {student.final}
                            </div>
                        </div>
                        {/* Note: Average displayed here is approximation or we can pass it if available */}
                    </div>

                    {/* Private Notes Section */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2 dark:text-slate-300">
                            <StickyNote className="w-4 h-4 text-indigo-500" />
                            Özel Notlar (Sadece siz görebilirsiniz)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Bu öğrenci hakkında notlar alın..."
                            className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                {isSaving ? 'Kaydediliyor...' : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Notu Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
