type ChangeFocusEventTypeDetail = {
    month: number,
    year: number
};

type ChangeFocusEventType = CustomEventInit<ChangeFocusEventTypeDetail>;

type MarkedCellChangedEventTypeDetail = {
    selectedDate: Date
};

type MarkedCellChangedEventType = CustomEventInit<MarkedCellChangedEventTypeDetail>;

export type { ChangeFocusEventType, MarkedCellChangedEventType };