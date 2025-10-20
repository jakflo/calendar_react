import { useContext } from 'react';
import { getMonthName, printYearWithBc } from './dateTools';
import { FocusedDateContext, MarkedDateContext } from './Calendar';


function CellIsMarked() {
    const { monthFocused, yearFocused } = useContext(FocusedDateContext);
    const { dateMarked } = useContext(MarkedDateContext);

    if (dateMarked === null) {
        return (
            <div id="marked-cell-text" />
        );
    } else {
        const markedCellDateTyped = dateMarked as Date;

        let jumpBackButton;
        if (monthFocused !== dateMarked.getMonth() + 1 || yearFocused !== dateMarked.getFullYear()) {
            jumpBackButton = (<JumpBackButton />);
        } else {
            jumpBackButton = null;
        }

        const dayText = `${markedCellDateTyped.getDate()}. ${getMonthName(markedCellDateTyped.getMonth() + 1)} ${printYearWithBc(markedCellDateTyped.getFullYear())}`;
        return (
            <div id="marked-cell-text">
            <p>{`Vybrán den ${dayText}`} {jumpBackButton}</p>
            </div>
        );
    }
}

function JumpBackButton() {
    const { dateMarked } = useContext(MarkedDateContext);
    const { setMonthFocused, setYearFocused } = useContext(FocusedDateContext);

    const jumpBack = () => {
        setMonthFocused(dateMarked!.getMonth() + 1);
        setYearFocused(dateMarked!.getFullYear());
    };

    return (
        <>
        <button type="button" onClick={jumpBack}>Skočit zpět</button>
        </>
    );
}

export default CellIsMarked;
