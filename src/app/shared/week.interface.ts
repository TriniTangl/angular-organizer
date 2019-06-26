import * as moment from 'moment';

export interface Day {
    value: moment.Moment;
    active: boolean;
    disabled: boolean;
    selected: boolean;
    amount: number | null;
}

export interface Week {
    days: Day[];
}
