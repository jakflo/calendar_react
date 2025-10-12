const dayNames = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

type monthNamesType = Record<number, string>;
const monthNames = {
    1: 'Leden',
    2: 'Únor',
    3: 'Březen',
    4: 'Duben',
    5: 'Květen',
    6: 'Červen',
    7: 'Červenec',
    8: 'Srpen',
    9: 'Září',
    10: 'Říjen',
    11: 'Listopad',
    12: 'Prosinec'
} as monthNamesType;

function getMonthName(month: number): string {
    if (month < 1 || month > 12 || !Number.isInteger(month)) {
        throw new Error('bad month');
    }

    return monthNames[month];
}

function printYearWithBc(year: number): string {
    checkYear(year);
    return `${Math.abs(year)}${year < 0 ? ' BC' : ''}`;
}

/**pouzivam-li k posunu o den v datumu pricteni, ci odecteni 86400 sekund k unixtime,
    pri prechodu z letniho na zimni cas je o hodinu mene, tudiz datum je spatne.
    To opravim prictenim ci odectenim hodiny.
    Achtung! Zde se pocita s tim, ze se pracuje pouze s datumem bez casu, tj. se predpoklada cas 00:00:00
*/
function dateDstFix(date: Date): Date {
    if (date.getHours() === 23) {
        const dateUnix = date.getTime();
        return new Date(dateUnix + 3600 * 1000);
    } else if (date.getHours() === 1) {
        const dateUnix = date.getTime();
        return new Date(dateUnix - 3600 * 1000);
    } else {
        return date;
    }
}

function checkYear(year: number) {
    if (!Number.isInteger(year)) {
        throw new Error('bad year');
    }
}

export {checkYear, dayNames, monthNames, getMonthName, printYearWithBc, dateDstFix};
