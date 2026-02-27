import { Task } from './task.js';
import { UrgentTask } from './urgentTask.js';

export class TaskFactory {
    static create(data) {
        if (data.isUrgent) {
            return new UrgentTask(data.id || Date.now(), data.title, data.completed);
        }
        return new Task(data.id || Date.now(), data.title, data.completed);
    }
}
