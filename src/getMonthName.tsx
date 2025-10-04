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

export { getMonthName, monthNames };
