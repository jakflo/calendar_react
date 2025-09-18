import WeekCell from './WeekCell';
import type { IsWeekCellMarked } from './Calendar';
import type IsWeekCellActive from './IsWeekCellActive';

interface WeekRowProps {
    startDate: Date;
    isWeekCellActive: IsWeekCellActive;
    isWeekCellMarked: IsWeekCellMarked;
}

function WeekRow(props: WeekRowProps) {
    let k;
    let cells = [];
    const startDateUnix = props.startDate.getTime();

    for (k = 0; k <= 6; k++) {
        const dateUnix = startDateUnix + (86400 * k * 1000);
        const cellId = dateUnix / 1000;
        const date = new Date(dateUnix);
        const cell = (<WeekCell
                        isWeekCellActive={props.isWeekCellActive}
                        isWeekCellMarked={props.isWeekCellMarked.isDateMarked(date)}
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
