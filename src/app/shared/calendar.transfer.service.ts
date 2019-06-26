import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Week } from './week.interface';

@Injectable({
    providedIn: 'root'
})
export class CalendarTransferService {
    public calendarTransfer: BehaviorSubject<Week[]> = new BehaviorSubject([]);

    constructor() {
    }
}
