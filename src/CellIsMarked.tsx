import { useState, useEffect } from 'react';
import { getMonthName, printYearWithBc } from './dateTools';
import type { ChangeFocusEventType, MarkedCellChangedEventType } from './EventTypes';

interface MonthYearProps {
    month: number|null;
    year: number|null;
}

function CellIsMarked(props: MonthYearProps) {
    const [markedCellDate, setMarkedCellDate] = useState<Date|null>(null);
    const [focusedMonth, setFocusedMonth] = useState(props.month);
    const [focusedYear, setFocusedYear] = useState(props.year);

    const markedMonth = markedCellDate !== null ? (markedCellDate as Date).getMonth() + 1 : null;
    const markedYear = markedCellDate !== null ? (markedCellDate as Date).getFullYear() : null;

    useEffect(() => {
        document.getElementById('marked-cell-text')?.addEventListener('markedCellChanged', (event) => {
            setMarkedCellDate((event as MarkedCellChangedEventType).detail!.selectedDate);
        });
        document.getElementById('calendar-table')?.addEventListener('changeFocus', (event) => {
            const eventTyped = event as ChangeFocusEventType;
            setFocusedMonth(eventTyped.detail!.month);
            setFocusedYear(eventTyped.detail!.year);
        });
    });

    if (markedCellDate === null) {
        return (
            <div id="marked-cell-text" />
        );
    } else {
        const markedCellDateTyped = markedCellDate as Date;
        let jumpBackButton;
        if (markedMonth !== focusedMonth || markedYear !== focusedYear) {
            jumpBackButton = (<JumpBackButton month={markedMonth} year={markedYear} />);
        } else {
            jumpBackButton = null;
        }

        const dayText = `${markedCellDateTyped.getDate()}. ${getMonthName(markedCellDateTyped.getMonth() + 1)} ${printYearWithBc(markedCellDateTyped.getFullYear())}`;
        return (
            <div id="marked-cell-text">
            <p>{`Vybrán den ${dayText}`} {jumpBackButton}</p>
            </div>
        );
    }
}

function JumpBackButton(props: MonthYearProps) {
    const jumpBack = () => {
        const changeFocusEvent = new CustomEvent('changeFocus', {detail: {
            month: props.month,
            year: props.year
        }});
        document.getElementById('calendar-table')?.dispatchEvent(changeFocusEvent);
    };

    return (
        <>
        <button type="button" onClick={jumpBack}>Skočit zpět</button>
        </>
    );
}

export default CellIsMarked;
