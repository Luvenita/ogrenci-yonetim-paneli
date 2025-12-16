
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExamCalendar({ courses = [] }) {
    const [date, setDate] = useState(new Date());

    // Helper to normalize date for comparison (ignore time)
    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const getTileContent = ({ date, view }) => {
        if (view !== 'month') return null;

        const examsOnDay = [];

        courses.forEach(course => {
            if (course.midtermDate) {
                const midterm = new Date(course.midtermDate);
                if (isSameDay(midterm, date)) {
                    examsOnDay.push({ type: 'Vize', course: course.name, color: 'bg-blue-500' });
                }
            }
            if (course.finalDate) {
                const final = new Date(course.finalDate);
                if (isSameDay(final, date)) {
                    examsOnDay.push({ type: 'Final', course: course.name, color: 'bg-red-500' });
                }
            }
        });

        if (examsOnDay.length > 0) {
            return (
                <div className="flex justify-center gap-1 mt-1">
                    {examsOnDay.map((exam, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${exam.color}`}
                            title={`${exam.course} - ${exam.type}`}
                        />
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 mb-4 dark:text-white">Sınav Takvimi</h3>
            <div className="calendar-container">
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileContent={getTileContent}
                    className="w-full border-0 font-sans text-sm"
                    prevLabel={<ChevronLeft className="w-4 h-4 text-slate-500" />}
                    nextLabel={<ChevronRight className="w-4 h-4 text-slate-500" />}
                    navigationLabel={({ date }) => (
                        <span className="text-slate-700 font-semibold dark:text-slate-200">
                            {date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                        </span>
                    )}
                />
            </div>
            <style jsx global>{`
                .react-calendar {
                    background: transparent;
                    width: 100%;
                }
                .react-calendar__tile {
                    padding: 10px 6px;
                    border-radius: 8px;
                    font-weight: 500;
                    color: #475569; /* slate-600 */
                }
                .dark .react-calendar__tile {
                    color: #cbd5e1; /* slate-300 */
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: #f1f5f9; /* slate-100 */
                }
                .dark .react-calendar__tile:enabled:hover,
                .dark .react-calendar__tile:enabled:focus {
                    background-color: rgba(30, 41, 59, 0.5); /* slate-800/50 */
                }
                .react-calendar__tile--now {
                    background: #e0f2fe; /* sky-100 */
                    color: #0284c7; /* sky-600 */
                }
                .dark .react-calendar__tile--now {
                    background: rgba(14, 165, 233, 0.2);
                    color: #38bdf8;
                }
                .react-calendar__tile--active {
                    background: #4f46e5 !important; /* indigo-600 */
                    color: white !important;
                }
                .react-calendar__month-view__days__day--weekend {
                    color: #ef4444; /* red-500 */
                }
                .dark .react-calendar__month-view__days__day--weekend {
                    color: #f87171; /* red-400 */
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: #f1f5f9;
                    border-radius: 8px;
                }
                .dark .react-calendar__navigation button:enabled:hover,
                .dark .react-calendar__navigation button:enabled:focus {
                    background-color: rgba(30, 41, 59, 0.5);
                }
            `}</style>
        </div>
    );
}
