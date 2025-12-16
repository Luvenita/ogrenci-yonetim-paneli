import React from 'react';

export function KPISkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-slate-200 rounded w-1/3 dark:bg-slate-700"></div>
                        <div className="h-10 w-10 bg-slate-200 rounded-full dark:bg-slate-700"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-1/4 dark:bg-slate-700"></div>
                </div>
            ))}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-6 dark:bg-slate-700"></div>
                <div className="flex justify-center items-center h-[200px]">
                    <div className="h-32 w-32 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-6 dark:bg-slate-700"></div>
                <div className="flex gap-4 items-end h-[200px] justify-between px-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-slate-200 w-full rounded-t dark:bg-slate-700" style={{ height: `${[40, 70, 50, 80, 60][i]}%` }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700 animate-pulse">
            <div className="flex justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                <div className="h-8 bg-slate-200 rounded w-full dark:bg-slate-700"></div>
            </div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 dark:border-slate-700">
                    <div className="h-4 bg-slate-200 rounded w-1/12 dark:bg-slate-700"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/12 dark:bg-slate-700"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/12 dark:bg-slate-700"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/12 dark:bg-slate-700"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/12 dark:bg-slate-700"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/12 dark:bg-slate-700"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/12 dark:bg-slate-700"></div>
                </div>
            ))}
        </div>
    );
}

export function HeaderSkeleton() {
    return (
        <div className="flex items-center justify-between mb-8 animate-pulse">
            <div>
                <div className="h-8 bg-slate-200 rounded w-64 mb-2 dark:bg-slate-700"></div>
                <div className="h-4 bg-slate-200 rounded w-48 dark:bg-slate-700"></div>
            </div>
            <div className="flex gap-3">
                <div className="h-10 w-24 bg-slate-200 rounded-lg dark:bg-slate-700"></div>
                <div className="h-10 w-24 bg-slate-200 rounded-lg dark:bg-slate-700"></div>
                <div className="h-10 w-12 bg-slate-200 rounded-lg dark:bg-slate-700"></div>
                <div className="h-10 w-32 bg-slate-200 rounded-lg dark:bg-slate-700"></div>
            </div>
        </div>
    )
}
