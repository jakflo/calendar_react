import { useEffect, useRef } from 'react';
import type { SelectHTMLAttributes } from "react";

type SelectorProps = SelectHTMLAttributes<HTMLSelectElement> & {
    data: Record<string, string>;
};

// z dict data vytvori <select<option>> element formu a pokud se zmeni defaultValue, tak se to prekresli s touto hodnotou
function Selector({ data, defaultValue, ...props }: SelectorProps) {
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (selectRef.current && selectRef.current.value !== defaultValue) {
            selectRef.current.value = String(defaultValue ?? "");
        }
    });

    return (
        <select ref={selectRef} defaultValue={defaultValue} {...props}>
            {Object.entries(data).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
      );
}

export default Selector;
