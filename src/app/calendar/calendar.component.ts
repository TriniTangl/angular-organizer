import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CalendarTransferService } from '../shared/calendar.transfer.service';
import { DateService } from '../shared/date.service';
import { TasksService } from '../shared/tasks.service';
import { Week } from '../shared/week.interface';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    public calendar: Week[];

    constructor(
        private dateService: DateService,
        private tasksService: TasksService,
        private calendarTransferService: CalendarTransferService
    ) {
    }

    ngOnInit() {
        this.dateService.date.subscribe(this.generate.bind(this));
        this.calendar.forEach(week => {
            week.days.forEach(day => {
                this.tasksService.getAmount(day.value).subscribe(
                    (res: number | null) => day.amount = res,
                    err => console.error(err));
            });
        });
        this.calendarTransferService.calendarTransfer.next(this.calendar);
        this.calendarTransferService.calendarTransfer.subscribe(
            (data: Week[]) => {
                this.calendar = data;
                console.log(this.calendar);
            }
        );
    }

    private generate(now: moment.Moment): void {
        const startDay = now.clone().startOf('month').startOf('isoWeek');
        const endDay = now.clone().endOf('month').endOf('isoWeek');
        const date = startDay.clone().subtract(1, 'day');
        const calendar = [];

        while (date.isBefore(endDay, 'day')) {
            calendar.push({
                days: Array(7)
                    .fill(0)
                    .map(() => {
                        const value: moment.Moment = date.add(1, 'day').clone();
                        const active: boolean = moment().isSame(value, 'date');
                        const disabled: boolean = !now.isSame(value, 'month');
                        const selected: boolean = now.isSame(value, 'date');
                        return {
                            value,
                            active,
                            disabled,
                            selected,
                            amount: null
                        };
                    })
            });
        }

        this.calendar = calendar;
    }

    public select(day: moment.Moment): void {
        this.dateService.changeDate(day);
        this.calendarTransferService.calendarTransfer.subscribe(
            (data: Week[]) => {
                this.calendar = data;
                console.log(this.calendar);
            }
        );
    }

}
