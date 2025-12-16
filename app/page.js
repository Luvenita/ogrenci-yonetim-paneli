'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Download, Settings, Moon, Sun, Search, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import KPICards from '@/components/KPICards';
import StudentTable from '@/components/StudentTable';
import AddStudentModal from '@/components/AddStudentModal';
import EditGradesModal from '@/components/EditGradesModal';
import GradeCharts from '@/components/GradeCharts';
import ManageCoursesModal from '@/components/ManageCoursesModal';
import ImportStudentsModal from '@/components/ImportStudentsModal';
import RiskAlert from '@/components/RiskAlert';
import StudentDetailModal from '@/components/StudentDetailModal';
import ExamCalendar from '@/components/ExamCalendar';
import { KPISkeleton, TableSkeleton, HeaderSkeleton } from '@/components/SkeletonLoader';
import { useTheme } from '@/components/ThemeProvider';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('Tümü');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageCoursesOpen, setIsManageCoursesOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [viewingStudent, setViewingStudent] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme } = useTheme();

    // Auth Guard
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Fetch Data (Students & Courses)
    useEffect(() => {
        if (!user) return;

        // Fetch Students (Only for this professor)
        const qStudents = query(
            collection(db, 'students'),
            where('professorId', '==', user.uid)
        );
        const unsubStudents = onSnapshot(qStudents, (snapshot) => {
            const studentData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => a.name.localeCompare(b.name));
            setStudents(studentData);
        });

        // Fetch Courses (Only for this professor)
        const qCourses = query(
            collection(db, 'courses'),
            where('professorId', '==', user.uid)
        );
        const unsubCourses = onSnapshot(qCourses, (snapshot) => {
            const courseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => a.name.localeCompare(b.name));
            setCourses(courseData);
        });

        return () => {
            unsubStudents();
            unsubCourses();
        };
    }, [user]);

    // Derived Data
    const courseOptions = ['Tümü', ...courses.map(c => c.name)];

    const filteredStudents = students.filter(s => {
        const matchesCourse = selectedCourse === 'Tümü' || s.course === selectedCourse;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = s.name.toLowerCase().includes(searchLower) ||
            (s.studentId && s.studentId.toLowerCase().includes(searchLower));
        return matchesCourse && matchesSearch;
    });

    // Calculate Risky Students
    const riskyStudents = students.map(s => {
        const course = courses.find(c => c.name === s.course);
        const midtermWeight = course?.midtermWeight ? course.midtermWeight / 100 : 0.4;
        const finalWeight = course?.finalWeight ? course.finalWeight / 100 : 0.6;
        const avg = ((s.midterm || 0) * midtermWeight) + ((s.final || 0) * finalWeight);

        const isHighAbsent = (s.absentDays || 0) > 3;
        const isFailing = avg < 50;

        if (isHighAbsent || isFailing) {
            return { ...s, avg, isHighAbsent, isFailing };
        }
        return null;
    }).filter(Boolean);

    const handleAddStudent = async (data) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'students'), {
                ...data,
                absentDays: 0,
                createdAt: new Date(),
                professorId: user.uid // Include User ID
            });
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Öğrenci eklenirken hata oluştu.");
        }
    };

    const handleUpdateAttendance = async (id, change) => {
        try {
            const student = students.find(s => s.id === id);
            if (!student) return;

            const newAbsentDays = Math.max(0, (student.absentDays || 0) + change);
            const studentRef = doc(db, 'students', id);
            await updateDoc(studentRef, { absentDays: newAbsentDays });
        } catch (error) {
            console.error("Error updating attendance:", error);
        }
    };

    const handleUpdateGrades = async (id, grades) => {
        try {
            const studentRef = doc(db, 'students', id);
            await updateDoc(studentRef, {
                midterm: grades.midterm,
                final: grades.final
            });
        } catch (error) {
            console.error("Error updating grades:", error);
        }
    };

    const handleSaveNote = async (id, note) => {
        try {
            const studentRef = doc(db, 'students', id);
            await updateDoc(studentRef, {
                privateNotes: note
            });

            // Note: Listener will update local state automatically
            // But we might want to close modal or show success? 
            // For now, modal handles its own close or stays open.
            setViewingStudent(prev => ({ ...prev, privateNotes: note })); // Optimistic update for modal view
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Not kaydedilirken hata oluştu.");
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) return;
        try {
            await deleteDoc(doc(db, 'students', id));
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const handleExport = () => {
        // Export only what matches the current filter
        const data = filteredStudents.map(s => {
            const midterm = s.midterm !== undefined ? s.midterm : 0;
            const final = s.final !== undefined ? s.final : 0;

            // Calculate Avg with Dynamic Weights
            const course = courses.find(c => c.name === s.course);
            const midtermWeight = course?.midtermWeight ? course.midtermWeight / 100 : 0.4;
            const finalWeight = course?.finalWeight ? course.finalWeight / 100 : 0.6;
            const avg = (midterm * midtermWeight) + (final * finalWeight);

            let letter = 'FF';
            if (avg >= 90) letter = 'AA';
            else if (avg >= 85) letter = 'BA';
            else if (avg >= 80) letter = 'BB';
            else if (avg >= 75) letter = 'CB';
            else if (avg >= 70) letter = 'CC';
            else if (avg >= 60) letter = 'DC';
            else if (avg >= 50) letter = 'DD';

            const isAbsentFailed = (s.absentDays || 0) >= 4;
            const status = (avg >= 50 && !isAbsentFailed) ? 'Geçti' : 'Kaldı';

            return {
                'Öğrenci No': s.studentId,
                'Ad Soyad': s.name,
                'Ders': s.course,
                'Vize': midterm,
                'Final': final,
                'Ortalama': avg.toFixed(1),
                'Harf Notu': letter,
                'Devamsızlık': s.absentDays || 0,
                'Durum': status
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, selectedCourse === 'Tümü' ? "Tüm Öğrenciler" : selectedCourse);
        XLSX.writeFile(workbook, "Ogrenci_Listesi.xlsx");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background-page)] p-6 transition-colors duration-200">
                <div className="max-w-6xl mx-auto space-y-6">
                    <HeaderSkeleton />
                    <KPISkeleton />
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <div className="h-10 w-64 bg-slate-200 rounded-lg dark:bg-slate-700 animate-pulse"></div>
                        <div className="h-10 w-48 bg-slate-200 rounded-lg dark:bg-slate-700 animate-pulse"></div>
                    </div>
                    <TableSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background-page)] p-6 transition-colors duration-200">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Öğrenci Yönetim Paneli</h1>
                        <p className="text-slate-500 dark:text-slate-400">Hoşgeldiniz, {user?.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            title="Excel İndir"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            title="Excel İle İçe Aktar"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            İçe Aktar
                        </button>
                        <button
                            onClick={() => setIsManageCoursesOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            title="Dersleri Yönet"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            title={theme === 'dark' ? "Açık Mod" : "Koyu Mod"}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Öğrenci Ekle
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Filter & Search Section */}
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Öğrenci Ara (Ad, No)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 min-w-[250px] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 min-w-[200px] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    >
                        {courseOptions.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>

                {/* KPI Section */}
                <KPICards students={filteredStudents} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts Details */}
                    <div className="lg:col-span-2">
                        <GradeCharts students={filteredStudents} courses={courses} />
                    </div>

                    {/* Sidebar: Calendar */}
                    <div className="space-y-6">
                        <ExamCalendar courses={courses} />
                    </div>
                </div>

                {/* Full Width Risk Alert Section */}
                <RiskAlert
                    riskyStudents={riskyStudents}
                    onEditStudent={(student) => setEditingStudent(student)}
                />

                {/* Student Table */}
                <StudentTable
                    students={filteredStudents}
                    courses={courses}
                    onUpdateAttendance={handleUpdateAttendance}
                    onDeleteStudent={handleDeleteStudent}
                    onEditGrades={(student) => setEditingStudent(student)}
                    onStudentClick={(student) => setViewingStudent(student)}
                />

                {/* Modals */}
                <AddStudentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddStudent}
                    courses={courses}
                />

                <ImportStudentsModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    user={user}
                    existingStudents={students}
                    courses={courses}
                />

                <EditGradesModal
                    isOpen={!!editingStudent}
                    onClose={() => setEditingStudent(null)}
                    student={editingStudent}
                    onSave={handleUpdateGrades}
                />

                <ManageCoursesModal
                    isOpen={isManageCoursesOpen}
                    onClose={() => setIsManageCoursesOpen(false)}
                    user={user}
                />

                <StudentDetailModal
                    isOpen={!!viewingStudent}
                    onClose={() => setViewingStudent(null)}
                    student={viewingStudent}
                    onSaveNote={handleSaveNote}
                />

            </div>
        </div>
    );
}
