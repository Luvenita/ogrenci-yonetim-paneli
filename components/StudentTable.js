
import { Plus, Minus, Trash2, Pencil, AlertTriangle, Edit2, StickyNote, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function StudentTable({ students, courses = [], onUpdateAttendance, onDeleteStudent, onEditGrades, onStudentClick }) {

    const handleDownloadPDF = async (student, e) => {
        e.stopPropagation();

        // Create hidden element for PDF generation
        const report = document.createElement('div');
        report.style.position = 'absolute';
        report.style.left = '-9999px';
        report.style.top = '0';
        report.style.width = '794px'; // A4 width at 96 DPI
        report.style.minHeight = '1123px'; // A4 height
        report.style.padding = '60px';
        report.style.backgroundColor = 'white';
        report.style.fontFamily = 'Inter, system-ui, sans-serif';
        report.style.color = '#0f172a'; // slate-900

        // Calculate values
        const { avg, letter } = calculateGrade(student.midterm, student.final, student.course);
        const isPassing = parseFloat(avg) >= 50 && (student.absentDays || 0) < 4;
        const status = (student.absentDays || 0) >= 4 ? "Devamsız" : (isPassing ? "Geçti" : "Kaldı");
        const statusColor = isPassing ? '#16a34a' : '#dc2626'; // green-600 : red-600

        report.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 40px;">
                <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #4338ca;">ÜNİVERSİTE YÖNETİM SİSTEMİ</h1>
                <h2 style="font-size: 18px; color: #64748b; font-weight: normal;">RESMİ NOT DÖKÜM BELGESİ</h2>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                <div style="line-height: 1.8;">
                    <p><strong>Öğrenci Adı:</strong> ${student.name}</p>
                    <p><strong>Öğrenci No:</strong> ${student.studentId}</p>
                    <p><strong>Bölüm/Ders:</strong> ${student.course}</p>
                </div>
                <div style="line-height: 1.8; text-align: right;">
                    <p><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                    <p><strong>Belge No:</strong> ${Math.floor(Math.random() * 1000000)}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                <thead>
                    <tr style="background-color: #f1f5f9; color: #475569;">
                        <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left;">Değerlendirme</th>
                        <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">Puan</th>
                        <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">Etki Oranı</th>
                        <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">Ağırlıklı Puan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 12px;">Vize Sınavı</td>
                        <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">${student.midterm || 0}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">%40</td>
                        <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">${((student.midterm || 0) * 0.4).toFixed(1)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 12px;">Final Sınavı</td>
                        <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">${student.final || 0}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">%60</td>
                        <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: center;">${((student.final || 0) * 0.6).toFixed(1)}</td>
                    </tr>
                </tbody>
            </table>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; width: 60%; margin-left: auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 18px; font-weight: bold;">
                    <span>Genel Ortalama:</span>
                    <span>${avg}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
                    <span>Harf Notu:</span>
                    <span>${letter}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 16px; color: ${statusColor}; font-weight: bold;">
                    <span>Başarı Durumu:</span>
                    <span>${status}</span>
                </div>
            </div>

            <div style="margin-top: 100px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <p>Bu belge elektronik ortamda oluşturulmuştur. Islak imza gerektirmez.</p>
                <p>© ${new Date().getFullYear()} Üniversite Öğrenci Yönetim Sistemi</p>
            </div>
        `;

        document.body.appendChild(report);

        try {
            const canvas = await html2canvas(report, { scale: 2 }); // 2x scale for better quality
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${student.name.replace(/\s+/g, '_')}_Karnesi.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("PDF oluşturulurken bir hata meydana geldi.");
        } finally {
            document.body.removeChild(report);
        }
    };

    const calculateGrade = (midterm, final, courseName) => {
        if (midterm === undefined || final === undefined) return { avg: '-', letter: '-' };

        // Find course to get weights
        const course = courses.find(c => c.name === courseName);
        const midtermWeight = course?.midtermWeight ? course.midtermWeight / 100 : 0.4;
        const finalWeight = course?.finalWeight ? course.finalWeight / 100 : 0.6;

        const avg = (midterm * midtermWeight) + (final * finalWeight);
        let letter = 'FF';
        let color = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';

        if (avg >= 90) { letter = 'AA'; color = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'; }
        else if (avg >= 85) { letter = 'BA'; color = 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'; }
        else if (avg >= 80) { letter = 'BB'; color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'; }
        else if (avg >= 75) { letter = 'CB'; color = 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'; }
        else if (avg >= 70) { letter = 'CC'; color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'; }
        else if (avg >= 60) { letter = 'DC'; color = 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'; }
        else if (avg >= 50) { letter = 'DD'; color = 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'; }

        return { avg: avg.toFixed(1), letter, color };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700 transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Öğrenci Adı</th>
                            <th className="px-4 py-3">No</th>
                            <th className="px-4 py-3">Ders</th>
                            <th className="px-4 py-3 text-center">Vize</th>
                            <th className="px-4 py-3 text-center">Final</th>
                            <th className="px-4 py-3 text-center">Ort</th>
                            <th className="px-4 py-3 text-center">Harf</th>
                            <th className="px-4 py-3 text-center">Devamsızlık</th>
                            <th className="px-4 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                    Henüz öğrenci eklenmedi.
                                </td>
                            </tr>
                        ) : (
                            students.map((student, index) => {
                                const isLimitExceeded = (student.absentDays || 0) >= 4;
                                const { avg, letter, color } = calculateGrade(student.midterm, student.final, student.course);

                                return (
                                    <tr
                                        key={student.id}
                                        className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-700/50 ${isLimitExceeded ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-200">{index + 1}</td>
                                        <td className={`px-4 py-4 font-medium ${isLimitExceeded ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-slate-200'}`}>
                                            <div
                                                onClick={() => onStudentClick && onStudentClick(student)}
                                                className="flex items-center gap-2 cursor-pointer hover:underline hover:text-indigo-600 transition-colors"
                                            >
                                                {student.name}
                                                {student.privateNotes && (
                                                    <StickyNote className="w-3.5 h-3.5 text-yellow-500 opacity-70" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{student.studentId}</td>
                                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold dark:bg-indigo-900/30 dark:text-indigo-300">
                                                {student.course}
                                            </span>
                                        </td>

                                        {/* Grades */}
                                        <td className="px-4 py-4 text-center font-mono text-slate-600 dark:text-slate-400">
                                            {student.midterm !== undefined ? student.midterm : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-center font-mono text-slate-600 dark:text-slate-400">
                                            {student.final !== undefined ? student.final : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200">
                                            {avg}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
                                                {letter}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onUpdateAttendance(student.id, -1)}
                                                    disabled={!student.absentDays || student.absentDays <= 0}
                                                    className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 dark:hover:bg-slate-700 dark:text-slate-400"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className={`font-bold w-6 text-center ${isLimitExceeded ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {student.absentDays || 0}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateAttendance(student.id, 1)}
                                                    className="p-1 rounded hover:bg-slate-200 text-slate-500 dark:hover:bg-slate-700 dark:text-slate-400"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                {isLimitExceeded && (
                                                    <span title="Devamsızlık Sınırı Aşıldı!" className="text-red-500 animate-pulse ml-1">
                                                        <AlertTriangle className="w-4 h-4" />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => handleDownloadPDF(student, e)}
                                                    className="p-1 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg dark:hover:bg-green-900/30 dark:hover:text-green-400"
                                                    title="PDF İndir"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onEditGrades(student)}
                                                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors dark:hover:text-indigo-400"
                                                    title="Not Gir"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {onDeleteStudent && (
                                                    <button
                                                        onClick={() => onDeleteStudent(student.id)}
                                                        className="p-1 text-slate-400 hover:text-red-600 transition-colors dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
