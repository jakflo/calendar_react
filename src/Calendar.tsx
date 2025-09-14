import { useState } from 'react';

interface CalendarProps {
    month: string;
    year: string;
}

function Calendar(props: CalendarProps) {
    const [month, setMonth] = useState(parseInt(props.month));
    const [year, setYear] = useState(parseInt(props.year));
    const dayNames = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

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
        } else {
            newMonth = 12;
            const newYear = year - 1;
            setMonth(newMonth);
            setYear(newYear);
        }
    };

    const nextMonth = () => {
        let newMonth = month + 1;
        if (newMonth <= 12) {
            setMonth(newMonth);
        } else {
            newMonth = 1;
            const newYear = year + 1;
            setMonth(newMonth);
            setYear(newYear);
        }
    };

    let daysHead = [];
    let k;
    for (k in dayNames) {
        let headCell = (<th key={`dayhead_${k}`}>{dayNames[k]}</th>);
        daysHead.push(headCell);
    }

    const startDate = getStartDate(month, year);
    let weekRows = [];
    for (k = 0; k <= 5; k++) {
        const dateUnix = startDate.getTime() + 86400 * k * 7 * 1000;
        const date = new Date(dateUnix);
        if (date.getMonth() + 1 === month + 1) {
            break;
        }

        const weekRow = (<WeekRow key={`weekrow_${k}`} startDate={date} />);
        weekRows.push(weekRow);
    }

    return (
        <>
        <h1>Kalendář pro měsíc {monthName} {year}</h1>
        <table id="calendarTable">
            <thead>
                <tr>{daysHead}</tr>
            </thead>
            <tbody>
                {weekRows}
            </tbody>
        </table>
        <div id="calendarButtons">
            <button type="button" onClick={prevMonth}>&lt;</button>
            <button type="button" onClick={nextMonth}>&gt;</button>
        </div>
        </>
    );
}

interface WeekRowProps {
    startDate: Date
}

function WeekRow(props: WeekRowProps) {
    let k;
    let cells = [];
    const startDateUnix = props.startDate.getTime();

    for (k = 0; k <= 6; k++) {
        const dateUnix = startDateUnix + (86400 * k * 1000);
        const cellId = dateUnix / 1000;
        const date = new Date(dateUnix);
        const cell = (<td key={`cell_${cellId}`}>{date.getDate()}</td>);
        cells.push(cell);
    }

    return (
        <>
        <tr>{cells}</tr>
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

function getMonthName(month: number): string {
    const names = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    if (month < 1 || month > 12 || !Number.isInteger(month)) {
        throw new Error('bad month');
    }

    return names[month - 1];
}

function checkYear(year: number) {
    if (!Number.isInteger(year) || year < 0) {
        throw new Error('bad year');
    }
}

export default Calendar