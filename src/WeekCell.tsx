import { useState, useEffect } from 'react';
import { addClass, removeClass } from './AddOrRemoveClass';
import type IsWeekCellActive from './IsWeekCellActive';

interface WeekCellProps {
    cellId:number,
    isWeekCellMarked: boolean,
    isWeekCellActive: IsWeekCellActive,
    date: Date
}

function WeekCell(props: WeekCellProps) {
    let initClassName = 'calendar-week-cell';
    const cellId = `cell_${props.cellId}`;
    const [cellIsActive, setCellIsActive] = useState<boolean|null>(null);
    const [isCellMarked, setIsCellMarked] = useState(props.isWeekCellMarked);

    if (cellIsActive === null && !props.isWeekCellActive.isCellActive(props.date)) {
        initClassName = addClass(initClassName, 'inactive');
        setCellIsActive(false);
    } else if (cellIsActive === null) {
        setCellIsActive(true);
    }

    if (isCellMarked) {
        initClassName = addClass(initClassName, 'marked');
    }

    const [className, setClassName] = useState(initClassName);

    useEffect(() => {
        document.getElementById(cellId)?.addEventListener('unmarkCells', () => {
            unmarkCell();
        })
    });

    const markCellUnmarkOthers = () => {
        if (!cellIsActive) {
            return;
        }

        const unmarkCellsEvent = new CustomEvent('unmarkCells');
        const cells = document.getElementsByClassName('calendar-week-cell');
        let k;
        for (k = 0; k < cells.length; k++) {
            cells[k].dispatchEvent(unmarkCellsEvent);
        }

        markCell();
        const markedCellChangedEvent = new CustomEvent('markedCellChanged', { detail: {selectedDate: props.date} });
        document.getElementById('marked-cell-text')?.dispatchEvent(markedCellChangedEvent);
        document.getElementById('calendar-table')?.dispatchEvent(markedCellChangedEvent);
    };

    const markCell = () => {
        setClassName(addClass(className, 'marked'));
        setIsCellMarked(true);
    };

    const unmarkCell = () => {
        setClassName(removeClass(className, 'marked'));
        setIsCellMarked(false);
    };

    return (
        <>
        <td className={className} id={cellId} onClick={markCellUnmarkOthers}>{props.date.getDate()}</td>
        </>
    );
}

export default WeekCell;
