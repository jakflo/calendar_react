function getMonthName(month: number): string {
    const names = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    if (month < 1 || month > 12 || !Number.isInteger(month)) {
        throw new Error('bad month');
    }

    return names[month - 1];
}

export default getMonthName;
