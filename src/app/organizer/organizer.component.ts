import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CalendarTransferService } from '../shared/calendar.transfer.service';
import { DateService } from '../shared/date.service';
import { Task } from '../shared/task.interface';
import { TasksService } from '../shared/tasks.service';
import { Week } from '../shared/week.interface';

@Component({
    selector: 'app-organizer',
    templateUrl: './organizer.component.html',
    styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
    public form: FormGroup;
    public tasks: Task[];

    constructor(
        public dataService: DateService,
        private tasksService: TasksService,
        private calendarTransferService: CalendarTransferService
    ) {
        this.tasks = [];
    }

    ngOnInit() {
        this.dataService.date.pipe(
            switchMap(value => this.tasksService.load(value))
        ).subscribe(tasks => {
            this.tasks = tasks;
        });

        this.form = new FormGroup({
            title: new FormControl('', Validators.required)
        });
    }

    public onSubmit(): void {
        const {title} = this.form.value;
        const task: Task = {
            title,
            date: this.dataService.date.value.format('DD-MM-YYYY')
        };

        this.tasksService.create(task).subscribe(
            taskResponse => {
                this.tasks.push(task);
                this.form.reset();
            },
            err => console.error(err));
        this.changeAmount(+1);
    }

    public remove(task: Task): void {
        this.tasksService.remove(task).subscribe(() => {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
        }, err => console.error(err));
        this.changeAmount(-1);
    }

    private changeAmount(step: number): void {
        this.calendarTransferService.calendarTransfer.subscribe(
            (data: Week[]) => {
                data.forEach(week => {
                    week.days.forEach(day => {
                        if (day.value === this.dataService.date.value) {
                            day.amount = day.amount + step;
                        }
                    });
                });
            }
        );
    }

}
