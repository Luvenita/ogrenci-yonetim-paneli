
import { X } from 'lucide-react';
import { useState } from 'react';


export default function AddStudentModal({ isOpen, onClose, onAdd, courses = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        course: courses.length > 0 ? courses[0].name : '',
        midterm: '',
        final: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            midterm: formData.midterm ? Number(formData.midterm) : undefined,
            final: formData.final ? Number(formData.final) : undefined,
        });
        setFormData({ name: '', studentId: '', course: courses.length > 0 ? courses[0].name : '', midterm: '', final: '' });
        onClose();
    };

    // Update course if it's empty and courses are available
    if (!formData.course && courses.length > 0) {
        setFormData(prev => ({ ...prev, course: courses[0].name }));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200 dark:bg-slate-800 transition-colors">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-6 dark:text-white">Yeni Öğrenci Ekle</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Ad Soyad
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            placeholder="Örn: Ahmet Yılmaz"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Öğrenci No
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            placeholder="Örn: 2023001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Ders
                        </label>
                        {courses.length > 0 ? (
                            <select
                                required
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            >
                                {courses.map(course => (
                                    <option key={course.id} value={course.name}>{course.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-sm text-red-500">
                                Lütfen önce "Dersleri Yönet" menüsünden ders ekleyin.
                            </div>
                        )}

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Vize (Opsiyonel)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.midterm}
                                onChange={(e) => setFormData({ ...formData, midterm: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                placeholder="0-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Final (Opsiyonel)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.final}
                                onChange={(e) => setFormData({ ...formData, final: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                placeholder="0-100"
                            />
                        </div>
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
