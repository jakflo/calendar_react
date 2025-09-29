import type { ButtonHTMLAttributes } from "react";
import { addClass } from './AddOrRemoveClass';
import './niceButton.css';

type NiceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

function NiceButton({ label, className, ...props }: NiceButtonProps) {
    const allClassnames = className !== undefined ? addClass('nice_button', className) : 'nice_button';
    return (
        <>
        <button type="button" className={allClassnames} {...props}>
            <span className="nice_button_top">{label}</span>
        </button>
        </>
    );
}

export default NiceButton;
