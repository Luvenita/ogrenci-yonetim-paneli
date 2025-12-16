import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ImportStudentsModal({ isOpen, onClose, user, existingStudents, courses }) {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = async (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            validateData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const validateData = (data) => {
        const validData = [];
        const newErrors = [];
        const courseNames = courses.map(c => c.name.toLowerCase());
        const existingIds = new Set(existingStudents.map(s => s.studentId?.toLowerCase()));

        data.forEach((row, index) => {
            const rowNum = index + 2; // Excel row number (1-header)

            // Normalize keys
            const name = row['Ad Soyad'] || row['Ad'] || row['Name'];
            const studentId = row['Öğrenci No'] || row['No'] || row['StudentId'];
            let course = row['Ders'] || row['Course'];
            const midterm = row['Vize'] || 0;
            const final = row['Final'] || 0;

            if (!name || !studentId) {
                newErrors.push(`Satır ${rowNum}: Ad Soyad veya Öğrenci No eksik.`);
                return;
            }

            if (existingIds.has(String(studentId).toLowerCase())) {
                newErrors.push(`Satır ${rowNum}: Öğrenci No (${studentId}) zaten kayıtlı.`);
                return;
            }

            // Course Validation/Default
            if (course) {
                const match = courses.find(c => c.name.toLowerCase() === String(course).toLowerCase());
                if (match) {
                    course = match.name;
                } else {
                    newErrors.push(`Satır ${rowNum}: "${course}" dersi bulunamadı.`);
                    return;
                }
            } else {
                // Optional: default to first course or require it
                // For now, let's require it or show error
                if (courses.length > 0) {
                    // course = courses[0].name; // Auto-assign first course? Maybe risky.
                    newErrors.push(`Satır ${rowNum}: Ders belirtilmemiş.`);
                    return;
                } else {
                    newErrors.push("Sistemde hiç ders yok. Önce ders ekleyin.");
                    return;
                }
            }

            validData.push({
                name,
                studentId: String(studentId),
                course,
                midterm: Number(midterm),
                final: Number(final),
            });
        });

        setPreviewData(validData);
        setErrors(newErrors);
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;
        setIsUploading(true);

        try {
            const batch = writeBatch(db);

            previewData.forEach(student => {
                const docRef = doc(collection(db, 'students'));
                batch.set(docRef, {
                    ...student,
                    professorId: user.uid,
                    absentDays: 0,
                    createdAt: new Date()
                });
            });

            await batch.commit();

            alert(`${previewData.length} öğrenci başarıyla eklendi!`);
            onClose();
            setFile(null);
            setPreviewData([]);
            setErrors([]);
        } catch (error) {
            console.error("Import error:", error);
            alert("İçe aktarma sırasında hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-in fade-in zoom-in duration-200 dark:bg-slate-800 transition-colors max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-6 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    Toplu Öğrenci Ekle (Excel)
                </h2>

                {/* File Upload Area */}
                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-10 cursor-pointer hover:bg-slate-50 hover:border-indigo-500 transition-colors dark:border-slate-600 dark:hover:bg-slate-700/50"
                    >
                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="text-slate-600 font-medium dark:text-slate-300">Excel dosyasını seçmek için tıklayın</p>
                        <p className="text-slate-400 text-sm mt-2 dark:text-slate-500">.xlsx veya .csv</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {/* Summary */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{file.name}</span>
                                <div className="text-sm mt-1 space-x-3">
                                    <span className="text-green-600 font-medium">{previewData.length} Geçerli</span>
                                    {errors.length > 0 && <span className="text-red-600 font-medium">{errors.length} Hata</span>}
                                </div>
                            </div>
                            <button onClick={() => { setFile(null); setPreviewData([]); setErrors([]); }} className="text-slate-400 hover:text-red-500 text-sm">
                                Dosyayı Kaldır
                            </button>
                        </div>

                        {/* Error List */}
                        {errors.length > 0 && (
                            <div className="mb-4 max-h-[100px] overflow-y-auto p-3 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                                {errors.map((err, i) => (
                                    <div key={i} className="flex items-center gap-2 text-red-600 text-sm mb-1 dark:text-red-400">
                                        <AlertCircle className="w-4 h-4" />
                                        {err}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Preview Table */}
                        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg mb-4 dark:border-slate-700">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 sticky top-0 dark:bg-slate-700">
                                    <tr>
                                        <th className="p-3 font-medium text-slate-600 dark:text-slate-300">Öğrenci No</th>
                                        <th className="p-3 font-medium text-slate-600 dark:text-slate-300">Ad Soyad</th>
                                        <th className="p-3 font-medium text-slate-600 dark:text-slate-300">Ders</th>
                                        <th className="p-3 font-medium text-slate-600 dark:text-slate-300">Vize</th>
                                        <th className="p-3 font-medium text-slate-600 dark:text-slate-300">Final</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {previewData.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 text-slate-700 dark:text-slate-300">{row.studentId}</td>
                                            <td className="p-3 text-slate-700 dark:text-slate-300">{row.name}</td>
                                            <td className="p-3 text-slate-700 dark:text-slate-300">{row.course}</td>
                                            <td className="p-3 text-slate-700 dark:text-slate-300">{row.midterm}</td>
                                            <td className="p-3 text-slate-700 dark:text-slate-300">{row.final}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {previewData.length === 0 && errors.length === 0 && (
                                <div className="p-8 text-center text-slate-500">Veri bulunamadı.</div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={previewData.length === 0 || isUploading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUploading ? 'Yükleniyor...' : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        {previewData.length} Öğrenciyi İçe Aktar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
