"use client";

import { useEffect, useState, useRef } from "react";
import { CaretDown, Plus, Minus } from "@phosphor-icons/react";

export type FilterOption = {
    id: string | number;
    label: string;
};

interface TriStateFilterDropdownProps {
    label: string;
    options: FilterOption[];
    includedIds: (string | number)[];
    excludedIds: (string | number)[];
    onInclude: (id: string | number) => void;
    onExclude: (id: string | number) => void;
    onReset: (id: string | number) => void;
    className?: string;
    gridCols?: number; // New prop for grid layout
}

export default function TriStateFilterDropdown({
    label,
    options,
    includedIds,
    excludedIds,
    onInclude,
    onExclude,
    onReset,
    className = "",
    gridCols = 1
}: TriStateFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = (id: string | number) => {
        if (includedIds.includes(id)) {
            // Included -> Excluded
            onReset(id); // Remove from included
            onExclude(id); // Add to excluded
        } else if (excludedIds.includes(id)) {
            // Excluded -> Neutral
            onReset(id); // Remove from excluded
        } else {
            // Neutral -> Included
            onInclude(id); // Add to included
        }
    };

    // Summarize selection for display
    const selectionCount = includedIds.length + excludedIds.length;
    const displayLabel = selectionCount > 0
        ? `${label} (${selectionCount})`
        : label;

    // Calculate width class based on grid cols
    // 1 col = default, 4 cols = wider
    const widthClass = gridCols > 1 ? "w-[600px] max-w-[90vw]" : "w-full min-w-[200px]";

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-zinc-800 border ${isOpen ? 'border-primary' : 'border-zinc-700'} rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors hover:border-zinc-500`}
            >
                <span className="truncate">{displayLabel}</span>
                <CaretDown size={12} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-full left-0 mt-1 bg-[#18181b] border border-zinc-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent p-4 ${widthClass}`}>

                    {/* Header if needed, e.g. for Genres */}
                    {gridCols > 1 && <div className="text-sm font-semibold text-zinc-400 mb-2 px-1">{label}</div>}

                    <div className={gridCols > 1 ? `grid grid-cols-2 md:grid-cols-${gridCols} gap-x-2 gap-y-1` : "flex flex-col gap-0.5"}>
                        {options.map((option) => {
                            const isIncluded = includedIds.includes(option.id);
                            const isExcluded = excludedIds.includes(option.id);

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleToggle(option.id)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors w-full text-left group hover:bg-zinc-800/50"
                                >
                                    {/* Box Indicator */}
                                    <div className={`h-4 w-4 shrink-0 flex items-center justify-center rounded-[2px] transition-colors
                                        ${isIncluded ? 'bg-[#4ade80] text-black' :
                                            isExcluded ? 'bg-[#f87171] text-white' :
                                                'bg-zinc-600 group-hover:bg-zinc-500'}`}
                                    >
                                        {isIncluded && <Plus size={10} weight="bold" />}
                                        {isExcluded && <Minus size={10} weight="bold" />}
                                    </div>

                                    {/* Label */}
                                    <span className={`uppercase font-medium truncate
                                        ${isIncluded ? 'text-[#4ade80]' :
                                            isExcluded ? 'text-[#f87171] line-through decoration-[#f87171]/50' :
                                                'text-zinc-400 group-hover:text-zinc-300'}`}
                                    >
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
