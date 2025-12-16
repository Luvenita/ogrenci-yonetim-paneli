
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EditGradesModal({ isOpen, onClose, student, onSave }) {
    const [grades, setGrades] = useState({ midterm: '', final: '' });

    useEffect(() => {
        if (student) {
            setGrades({
                midterm: student.midterm || '',
                final: student.final || ''
            });
        }
    }, [student]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(student.id, {
            midterm: Number(grades.midterm),
            final: Number(grades.final)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200 dark:bg-slate-800 transition-colors">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-6 dark:text-white">Not Girişi</h2>
                <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">{student?.name}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Vize Notu (%40)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={grades.midterm}
                            onChange={(e) => setGrades({ ...grades, midterm: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            placeholder="0-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Final Notu (%60)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={grades.final}
                            onChange={(e) => setGrades({ ...grades, final: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            placeholder="0-100"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
