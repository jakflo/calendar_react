import WeekCell from './WeekCell';
import { dateDstFix } from './dateTools';

interface WeekRowProps {
    startDate: Date;
}

function WeekRow(props: WeekRowProps) {
    let k;
    const cells = [];
    const startDateUnix = props.startDate.getTime();

    for (k = 0; k <= 6; k++) {
        const dateUnix = startDateUnix + (86400 * k * 1000);
        const cellId = dateUnix / 1000;
        const date = dateDstFix((new Date(dateUnix)));
        const cell = (<WeekCell
                        date={date}
                        key={cellId}
                        cellId={cellId}
                    />);
        cells.push(cell);
    }

    return (
        <>
        <tr className="calendar-week-row">{cells}</tr>
        </>
    );
}

export default WeekRow;
