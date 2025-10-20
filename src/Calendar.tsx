import { useState, createContext, useContext } from 'react';
import type { FormEvent, ButtonHTMLAttributes, ReactNode, Dispatch, SetStateAction } from 'react';
import WeekRow from './WeekRow';
import IsWeekCellActive from './IsWeekCellActive';
import CellIsMarked from './CellIsMarked';
import { checkYear, dayNames, getMonthName, monthNames, printYearWithBc, dateDstFix } from './dateTools';
import './calendar.css';
import NiceButton from './NiceButton';
import Selector from './Selector';
import InputRefreshed from './InputRefreshed';

interface CalendarProps {
    month: string;
    year: string;
}

type focusedDateContextType = {
    monthFocused: number;
    setMonthFocused: Dispatch<SetStateAction<number>>;
    yearFocused: number;
    setYearFocused: Dispatch<SetStateAction<number>>;
};

const FocusedDateContext = createContext<focusedDateContextType>({
    monthFocused: 0,
    setMonthFocused: () => {},
    yearFocused: 0,
    setYearFocused: () => {}
});

type markedDateContextType = {
    dateMarked: Date | null;
    setDateMarked: Dispatch<SetStateAction<Date | null>>;
};

const MarkedDateContext = createContext<markedDateContextType>({
    dateMarked: null,
    setDateMarked: () => {}
});

const IsWeekCellActiveContext = createContext((new IsWeekCellActive()));

function Calendar(props: CalendarProps) {
    const [monthFocused, setMonthFocused] = useState(parseInt(props.month));
    const [yearFocused, setYearFocused] = useState(parseInt(props.year));
    const [dateMarked, setDateMarked] = useState<Date | null>(null);

    let monthName;
    try {
        checkYear(yearFocused);
        monthName = getMonthName(monthFocused);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch(err) {
        return (
            <>
            Špatný formát měsíce/roku
            </>
        );
    }

    const prevMonth = () => {
        let newMonth = monthFocused - 1;
        if (newMonth > 0) {
            setMonthFocused(newMonth);
        } else {
            newMonth = 12;
            const newYear = yearFocused - 1;
            setMonthFocused(newMonth);
            setYearFocused(newYear);
        }
    };

    const nextMonth = () => {
        let newMonth = monthFocused + 1;
        if (newMonth <= 12) {
            setMonthFocused(newMonth);
        } else {
            newMonth = 1;
            const newYear = yearFocused + 1;
            setMonthFocused(newMonth);
            setYearFocused(newYear);
        }
    };

    const quickjumpFormSubmitted = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newMonth = parseInt(data.get('month') as string);

        // dame kladny nebo zaporny rok, dle AD nebo BC
        let newYear = parseInt(data.get('year') as string);
        if ((data.get('bc-on') === '1' && newYear > 0) || (data.get('bc-on') === '0' && newYear < 0)) {
            newYear *= (-1);
        }

        setMonthFocused(newMonth);
        setYearFocused(newYear);
    };

    const daysHead = [];
    let k;
    for (k in dayNames) {
        const headCell = (<th key={`dayhead_${k}`}>{dayNames[k]}</th>);
        daysHead.push(headCell);
    }

    const startDate = getStartDate(monthFocused, yearFocused);
    const weekRows = [];
    for (k = 0; k <= 5; k++) {
        const dateUnix = startDate.getTime() + 86400 * k * 7 * 1000;
        const date = dateDstFix((new Date(dateUnix)));
        if (date.getMonth() + 1 === monthFocused + 1 || date.getFullYear() > yearFocused) {
            break;
        }

        const weekRow = (<WeekRow
                            key={`weekrow_${k}`}
                            startDate={date}
                        />);
        weekRows.push(weekRow);
    }

    const CalendarProviders = ({ children }: { children: ReactNode }) => {
        return (
        <>
        <FocusedDateContext.Provider value={{ monthFocused, setMonthFocused, yearFocused, setYearFocused }}>
            <MarkedDateContext.Provider value={{ dateMarked, setDateMarked }}>
                { children }
            </MarkedDateContext.Provider>
        </FocusedDateContext.Provider>
        </>
        );
    }

    return (
        <>
        <CalendarProviders>
            <h1>Kalendář pro měsíc {monthName} {printYearWithBc(yearFocused)}</h1>
            <CellIsMarked />
            <table id="calendar-table">
                <thead>
                    <tr id="calendar-table-head">{daysHead}</tr>
                </thead>
                <tbody>
                    <IsWeekCellActiveContext.Provider value={ (new IsWeekCellActive()) }>
                        {weekRows}
                    </IsWeekCellActiveContext.Provider>
                </tbody>
            </table>
            <div id="calendar-buttons">
                <form id="calendar-quickjump-form" onSubmit={quickjumpFormSubmitted}>
                    <NiceButton type="button" onClick={prevMonth} label=" &lt; " />
                    <Selector data={monthNames} name="month" defaultValue={monthFocused} />
                    <AdBcSwitch />
                    <InputRefreshed type="number" name="year" defaultValue={Math.abs(yearFocused)} step="1" min={0} size={8} required />
                    <NiceButton className="green-button" type="submit" label="Skoč" />
                    <NiceButton type="button" onClick={nextMonth} label=" &gt; " />
                </form>
            </div>
        </CalendarProviders>
        </>
    );
}

// prepimac mezi AD a BC, tj., zda neni letopocet pred Kristem, tudiz zaporny rok
type AdBcSwitchProps = ButtonHTMLAttributes<HTMLButtonElement>;

function AdBcSwitch({ ...props }: AdBcSwitchProps) {
    const { yearFocused } = useContext(FocusedDateContext);
    const [bcOn, setBcOn] = useState(yearFocused < 0);

    const switchPushed = () => {
        setBcOn(!bcOn);
    };

    return (
        <>
        <NiceButton type="button" label={bcOn ? 'BC' : 'AD'} onClick={switchPushed} {...props} />
        <input type="hidden" name="bc-on" value={bcOn ? '1' : '0'} />
        </>
    );
}

// pokud 1. den mesice nevyjde na pondelek, tak to vrati datum o par dni driv, tak aby to vyslo na pondelek
function getStartDate(month: number, year: number): Date {
    const startDate = new Date(`${year}-${month}-01 00:00:00`);
    if (year < 100) {
        startDate.setFullYear(year);
    }

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

export { Calendar, FocusedDateContext, MarkedDateContext, IsWeekCellActiveContext };
