import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ManageCoursesModal({ isOpen, onClose, user }) {
    const [courses, setCourses] = useState([]);

    // Form State
    const [newCourse, setNewCourse] = useState({
        name: '',
        midtermWeight: 40,
        finalWeight: 60,
        midtermDate: '',
        finalDate: ''
    });

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editingCourse, setEditingCourse] = useState({
        name: '',
        midtermWeight: 40,
        finalWeight: 60,
        midtermDate: '',
        finalDate: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !user) return;

        const q = query(
            collection(db, 'courses'),
            where('professorId', '==', user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const courseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => a.name.localeCompare(b.name));
            setCourses(courseData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isOpen, user]);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.name.trim()) return;

        if (Number(newCourse.midtermWeight) + Number(newCourse.finalWeight) !== 100) {
            alert("Vize ve Final oranları toplamı 100 olmalıdır!");
            return;
        }

        try {
            if (!user) {
                alert("Kullanıcı oturumu bulunamadı!");
                return;
            }
            await addDoc(collection(db, 'courses'), {
                name: newCourse.name.trim(),
                midtermWeight: Number(newCourse.midtermWeight),
                finalWeight: Number(newCourse.finalWeight),
                midtermDate: newCourse.midtermDate || null,
                finalDate: newCourse.finalDate || null,
                createdAt: new Date(),
                professorId: user.uid // Include User ID
            });
            setNewCourse({
                name: '',
                midtermWeight: 40,
                finalWeight: 60,
                midtermDate: '',
                finalDate: ''
            });
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Ders eklenirken bir hata oluştu.");
        }
    };

    const startEditing = (course) => {
        setEditingId(course.id);
        setEditingCourse({
            name: course.name,
            midtermWeight: course.midtermWeight || 40,
            finalWeight: course.finalWeight || 60,
            midtermDate: course.midtermDate || '',
            finalDate: course.finalDate || ''
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingCourse({ name: '', midtermWeight: '', finalWeight: '', midtermDate: '', finalDate: '' });
    };

    const handleUpdateCourse = async () => {
        if (!editingCourse.name.trim()) return;
        if (Number(editingCourse.midtermWeight) + Number(editingCourse.finalWeight) !== 100) {
            alert("Vize ve Final oranları toplamı 100 olmalıdır!");
            return;
        }

        try {
            const courseRef = doc(db, 'courses', editingId);
            await updateDoc(courseRef, {
                name: editingCourse.name.trim(),
                midtermWeight: Number(editingCourse.midtermWeight),
                finalWeight: Number(editingCourse.finalWeight),
                midtermDate: editingCourse.midtermDate || null,
                finalDate: editingCourse.finalDate || null
            });
            setEditingId(null);
        } catch (error) {
            console.error("Error updating course:", error);
            alert("Ders güncellenirken hata oluştu.");
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!confirm("Bu dersi silmek istediğinize emin misiniz?")) return;
        try {
            await deleteDoc(doc(db, 'courses', id));
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200 dark:bg-slate-800 transition-colors">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-6 dark:text-white">Dersleri Yönet</h2>

                {/* Add Course Form */}
                <form onSubmit={handleAddCourse} className="space-y-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Yeni Ders Ekle</label>
                        <input
                            type="text"
                            value={newCourse.name}
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            placeholder="Örn: Fizik 101"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Vize Ağırlığı (%)</label>
                            <input
                                type="number"
                                value={newCourse.midtermWeight}
                                onChange={(e) => setNewCourse({ ...newCourse, midtermWeight: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Final Ağırlığı (%)</label>
                            <input
                                type="number"
                                value={newCourse.finalWeight}
                                onChange={(e) => setNewCourse({ ...newCourse, finalWeight: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Vize Tarihi</label>
                            <input
                                type="date"
                                value={newCourse.midtermDate || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, midtermDate: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Final Tarihi</label>
                            <input
                                type="date"
                                value={newCourse.finalDate || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, finalDate: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Ekle
                    </button>
                </form>

                {/* Course List */}
                <h3 className="text-sm font-bold text-slate-900 mb-3 dark:text-white">Mevcut Dersler</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {loading ? (
                        <p className="text-center text-slate-500 py-4 dark:text-slate-400">Yükleniyor...</p>
                    ) : courses.length === 0 ? (
                        <p className="text-center text-slate-500 py-4 dark:text-slate-400">Henüz ders eklenmemiş.</p>
                    ) : (
                        courses.map(course => (
                            <div key={course.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 dark:bg-slate-700/50 dark:border-slate-700 transition-colors">

                                {editingId === course.id ? (
                                    // Editing Mode
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editingCourse.name}
                                            onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                        />
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Vize Ağırlığı (%)</label>
                                                <input
                                                    type="number"
                                                    value={editingCourse.midtermWeight}
                                                    onChange={(e) => setEditingCourse({ ...editingCourse, midtermWeight: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Final Ağırlığı (%)</label>
                                                <input
                                                    type="number"
                                                    value={editingCourse.finalWeight}
                                                    onChange={(e) => setEditingCourse({ ...editingCourse, finalWeight: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Vize Tarihi</label>
                                                <input
                                                    type="date"
                                                    value={editingCourse.midtermDate || ''}
                                                    onChange={(e) => setEditingCourse({ ...editingCourse, midtermDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Final Tarihi</label>
                                                <input
                                                    type="date"
                                                    value={editingCourse.finalDate || ''}
                                                    onChange={(e) => setEditingCourse({ ...editingCourse, finalDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button onClick={cancelEditing} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button onClick={handleUpdateCourse} className="p-1 text-green-600 hover:text-green-700">
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Display Mode
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-slate-700 dark:text-slate-200 block">{course.name}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                Vize: %{course.midtermWeight || 40} | Final: %{course.finalWeight || 60}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => startEditing(course)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors dark:hover:text-indigo-400"
                                                title="Düzenle"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors dark:hover:text-red-400"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
