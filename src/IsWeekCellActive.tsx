// jsou-li na zacatku dny prechoziho mesice, nebo na konci dny dalsiho mesice, cheme tyto dny oznacit jako neaktivni
class IsWeekCellActive {
    private firstRun: boolean = true;
    private restOfPrevMonth: boolean = false;
    private overFlewToNextMonth: boolean = false;
    private lastDay: number|null = null;

    isCellActive(date: Date): boolean {
        const day = date.getDate();
        const isDoopledCall = this.isDoopledCall(day);
        if (this.firstRun && day === 1) {
            this.firstRun = false;
            return true;
        } else if (this.firstRun) {
            this.firstRun = false;
            this.restOfPrevMonth = true;
            return false;
        } else if (this.restOfPrevMonth && day === 1) {
            this.restOfPrevMonth = false;
            return true;
        } else if (this.restOfPrevMonth) {
            return false;
        } else if (day === 1 && !isDoopledCall) {
            this.overFlewToNextMonth = true;
            return false;
        } else if (this.overFlewToNextMonth) {
            return false;
        } else {
            return true;
        }
    }

    // obcas se kompomenty renderuji dvojite, coz vede k dvojitemu zavolani isCellActive, coz vede ke zmatkum
    isDoopledCall(day: number): boolean {
        if (this.firstRun) {
            this.lastDay = day;
            return false;
        }

        if (this.lastDay === day) {
            this.lastDay = day;
            return true;
        } else {
            this.lastDay = day;
            return false;
        }
    }
}

export default IsWeekCellActive;
