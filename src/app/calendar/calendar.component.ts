import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateService } from '../shared/date.service';
import { Week } from '../shared/week.interface';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    public calendar: Week[];

    constructor(
        private dateService: DateService
    ) {
    }

    ngOnInit() {
        this.dateService.date.subscribe(this.generate.bind(this));
    }

    private generate(now: moment.Moment): void {
        const startDay = now.clone().startOf('month').startOf('week');
        const endDay = now.clone().endOf('month').endOf('week');
        const date = startDay.clone().subtract(1, 'day');
        const calendar = [];

        while (date.isBefore(endDay, 'day')) {
            calendar.push({
                days: Array(7)
                    .fill(0)
                    .map(() => {
                        const value = date.add(1, 'day').clone();
                        const active = moment().isSame(value, 'date');
                        const disabled = !now.isSame(value, 'month');
                        const selected = now.isSame(value, 'date');

                        return {
                            value, active, disabled, selected
                        };
                })
            });
        }

        this.calendar = calendar;
    }

    public select(day: moment.Moment): void {
        this.dateService.changeDate(day);
    }

}
