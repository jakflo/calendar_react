import { useState, useEffect } from 'react';
import WeekRow from './WeekRow';
import IsWeekCellActive from './IsWeekCellActive';
import CellIsMarked from './CellIsMarked';
import getMonthName from './getMonthName';
import dayNames from './dayNames';
import './calendar.css';
import type { ChangeFocusEventType, MarkedCellChangedEventType } from './EventTypes';

interface CalendarProps {
    month: string;
    year: string;
}

function Calendar(props: CalendarProps) {
    const [month, setMonth] = useState(parseInt(props.month));
    const [year, setYear] = useState(parseInt(props.year));
    const [isWeekCellMarked, setIsWeekCellMarked] = useState((new IsWeekCellMarked()));

    useEffect(() => {
        const element = document.getElementById('calendar-table');
        element?.addEventListener('changeFocus', (event: ChangeFocusEventType) => {
            setMonth(event.detail!.month);
            setYear(event.detail!.year);
        });
        element?.addEventListener('markedCellChanged', (event: MarkedCellChangedEventType) => {
            const newIsWeekCellMarked = isWeekCellMarked;
            newIsWeekCellMarked.setMarkedDate(event.detail!.selectedDate);
            setIsWeekCellMarked(newIsWeekCellMarked);
        });
    });

    let monthName;
    try {
        checkYear(year);
        monthName = getMonthName(month);
    } catch(err) {
        return (
            <>
            Špatný formát měsíce/roku
            </>
        );
    }

    const prevMonth = () => {
        let newMonth = month - 1;
        if (newMonth > 0) {
            setMonth(newMonth);
            fireMonthChangedEvent(newMonth, year);
        } else {
            newMonth = 12;
            const newYear = year - 1;
            setMonth(newMonth);
            setYear(newYear);
            fireMonthChangedEvent(newMonth, newYear);
        }
    };

    const nextMonth = () => {
        let newMonth = month + 1;
        if (newMonth <= 12) {
            setMonth(newMonth);
            fireMonthChangedEvent(newMonth, year);
        } else {
            newMonth = 1;
            const newYear = year + 1;
            setMonth(newMonth);
            setYear(newYear);
            fireMonthChangedEvent(newMonth, newYear);
        }
    };

    const fireMonthChangedEvent = (month: number, year: number) => {
        const changeFocusEvent = new CustomEvent('changeFocus', { detail: {
            month: month,
            year: year
        } });
        document.getElementById('calendar-table')?.dispatchEvent(changeFocusEvent);
    };

    let daysHead = [];
    let k;
    for (k in dayNames) {
        let headCell = (<th key={`dayhead_${k}`}>{dayNames[k]}</th>);
        daysHead.push(headCell);
    }

    const startDate = getStartDate(month, year);
    const isWeekCellActive = new IsWeekCellActive();
    let weekRows = [];
    for (k = 0; k <= 5; k++) {
        const dateUnix = startDate.getTime() + 86400 * k * 7 * 1000;
        const date = new Date(dateUnix);
        if (date.getMonth() + 1 === month + 1 || date.getFullYear() > year) {
            break;
        }

        const weekRow = (<WeekRow
                            isWeekCellActive={isWeekCellActive}
                            isWeekCellMarked={isWeekCellMarked}
                            key={`weekrow_${k}`}
                            startDate={date}
                        />);
        weekRows.push(weekRow);
    }

    return (
        <>
        <h1>Kalendář pro měsíc {monthName} {year}</h1>
        <CellIsMarked month={month} year={year} />
        <table id="calendar-table">
            <thead>
                <tr id="calendar-table-head">{daysHead}</tr>
            </thead>
            <tbody>
                {weekRows}
            </tbody>
        </table>
        <div id="calendar-buttons">
            <button type="button" onClick={prevMonth}>&lt;</button>
            <button type="button" onClick={nextMonth}>&gt;</button>
        </div>
        </>
    );
}

// pokud 1. den mesice nevyjde na pondelek, tak to vrati datum o par dni driv, tak aby to vyslo na pondelek
function getStartDate(month: number, year: number): Date {
    let startDate = new Date(`${year}-${month}-01 00:00:00`);
    const fstDay = startDate.getDay();
    let rewindDay = 0;

    if (fstDay === 1) {
        return startDate;
    } else if (fstDay === 0) {
        rewindDay = 6;
    } else {
        rewindDay = fstDay - 1;
    }

    const unixDate = startDate.getTime() - 86400 * rewindDay * 1000;
    return new Date(unixDate);
}

function checkYear(year: number) {
    if (!Number.isInteger(year) || year < 0) {
        throw new Error('bad year');
    }
}

class IsWeekCellMarked {
    private markedDate: Date|null = null;

    isDateMarked(date: Date): boolean {
        if (this.markedDate === null) {
            return false;
        }

        return this.markedDate.getTime() === date.getTime();
    }

    setMarkedDate(markedDate: Date|null) {
        this.markedDate = markedDate;
    }

}

export { Calendar, IsWeekCellMarked };
