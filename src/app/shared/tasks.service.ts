import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateResponse, Task } from './task.interface';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private static utl: string = 'https://angular-organizer1.firebaseio.com/tasks';

    constructor(
        private http: HttpClient
    ) {
    }

    public create(task: Task): Observable<Task> {
        return this.http
            .post<CreateResponse>(`${TasksService.utl}/${task.date}.json`, task)
            .pipe(map(res => {
                return {
                    ...task,
                    id: res.name};
            }));
    }

    public load(date: moment.Moment): Observable<Task[]> {
        return this.http
            .get<Task[]>(`${TasksService.utl}/${date.format('DD-MM-YYYY')}.json`)
            .pipe(map(tasks => {
                console.log(tasks);
                return tasks ? Object.keys(tasks).map(key => ({...tasks[key], id: key})) : [];
            }));
    }

    public remove(task: Task): Observable<void> {
        return this.http
            .delete<void>(`${TasksService.utl}/${task.date}/${task.id}.json`);
    }

    public getAmount(date: moment.Moment): Observable<number | null> {
        return this.http
            .get<Task[]>(`${TasksService.utl}/${date.format('DD-MM-YYYY')}.json`)
            .pipe(map(tasks => {
                return tasks ? Object.keys(tasks).length : null;
            }));
    }
}
