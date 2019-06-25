import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { Task } from '../shared/task.interface';
import { TasksService } from '../shared/tasks.service';

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
        private tasksService: TasksService
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
    }

    public remove(task: Task): void {
        this.tasksService.remove(task).subscribe(() => {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
        }, err => console.error(err));
    }

}
