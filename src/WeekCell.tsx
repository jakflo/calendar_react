import { useContext } from 'react';
import { addClass } from './AddOrRemoveClass';
import { IsWeekCellActiveContext, MarkedDateContext } from './Calendar';

interface WeekCellProps {
    cellId:number,
    date: Date
}

function WeekCell(props: WeekCellProps) {
    let className = 'calendar-week-cell';
    const cellId = `cell_${props.cellId}`;
    const isWeekCellActive = useContext(IsWeekCellActiveContext);
    const { dateMarked, setDateMarked } = useContext(MarkedDateContext);

    const isWeekCellMarked = new IsWeekCellMarked();
    isWeekCellMarked.setMarkedDate(dateMarked);

    let cellIsActive;
    if (!isWeekCellActive.isCellActive(props.date)) {
        className = addClass(className, 'inactive');
        cellIsActive = false;
    } else {
        cellIsActive = true;
    }

    if (isWeekCellMarked.isDateMarked(props.date)) {
        className = addClass(className, 'marked');
    }

    const markCell = () => {
        if (cellIsActive) {
            setDateMarked(props.date);
        }
    };

    return (
        <>
        <td className={className} id={cellId} onClick={markCell}>{props.date.getDate()}</td>
        </>
    );
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

export default WeekCell;
