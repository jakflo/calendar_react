import { useContext, useState } from 'react';
import type { FormEvent, ButtonHTMLAttributes } from 'react';
import NiceButton from './NiceButton';
import Selector from './Selector';
import InputRefreshed from './InputRefreshed';
import { monthNames } from './dateTools';
import { FocusedDateContext } from './Calendar';

function MonthQuickjumpForm() {
    const { monthFocused, setMonthFocused, yearFocused, setYearFocused } = useContext(FocusedDateContext);

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

    return (
        <>
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

export default MonthQuickjumpForm;
