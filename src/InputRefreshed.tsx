import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// pokud se zmeni defaultValue, tak se to prekresli s touto hodnotou
function InputRefreshed({ defaultValue, ...props }: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== defaultValue) {
            inputRef.current.value = String(defaultValue ?? "");
        }
    });

    return (
        <>
        <input ref={inputRef} defaultValue={defaultValue} {...props} />
        </>
    );
}

export default InputRefreshed;
