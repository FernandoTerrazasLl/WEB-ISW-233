import { Task } from './task.js';

export class UrgentTask extends Task {
    constructor(id, title, completed) {
        super(id, title, completed);
        this.priority = 'High';
    }
}
