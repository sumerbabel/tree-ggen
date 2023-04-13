import {Subject } from 'rxjs';
const subject$ = new Subject<boolean>();

export const spinnerService = {
    openSpinner: () => subject$.next(true),
    closeSpinner: () => subject$.next(false),
    getSpinnerSubject: () => subject$.asObservable()
};