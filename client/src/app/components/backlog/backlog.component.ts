import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdDate: Date;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-backlog',
  standalone: false,
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
  providers: [DatePipe]
})
export class BacklogComponent {
  selectedDate: Date | null = null;
  selectedFilter: 'created' | 'deadline' = 'created';
  tasks: Task[] = [
    {
      id: 1,
      title: 'Implement authentication',
      description: 'Create login and registration pages with JWT support',
      status: 'done',
      createdDate: new Date(2025, 3, 15),
      deadline: new Date(2025, 6, 1),
      priority: 'high'
    },
    {
      id: 2,
      title: 'Design dashboard UI',
      description: 'Create mockups for the main dashboard interface',
      status: 'in-progress',
      createdDate: new Date(2025, 5, 20),
      deadline: new Date(2025, 6, 10),
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Database schema',
      description: 'Design the initial database schema for the application',
      status: 'todo',
      createdDate: new Date(2025, 5, 10),
      deadline: new Date(2025, 5, 30),
      priority: 'high'
    },
    {
      id: 4,
      title: 'API documentation',
      description: 'Write Swagger documentation for all endpoints',
      status: 'todo',
      createdDate: new Date(2025, 5, 25),
      deadline: new Date(2025, 6, 15),
      priority: 'low'
    }
    // ... rest of your tasks array remains the same
  ];

  constructor(private datePipe: DatePipe) {}

  // Update this method to accept Date | null
  onDateSelected(date: Date | null): void {
    this.selectedDate = date;
  }

  // Update this method to handle null dates
  dateClass = (date: Date): string[] => {
    if (!this.tasks.length) return [];
    
    const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    
    const hasCreatedTask = this.tasks.some(task => 
      this.datePipe.transform(task.createdDate, 'yyyy-MM-dd') === dateStr
    );
    
    const hasDeadlineTask = this.tasks.some(task => 
      this.datePipe.transform(task.deadline, 'yyyy-MM-dd') === dateStr
    );

    if (hasCreatedTask && hasDeadlineTask) {
      return ['both-dates'];
    } else if (hasCreatedTask) {
      return ['created-date'];
    } else if (hasDeadlineTask) {
      return ['deadline-date'];
    }

    return [];
  };

  // Update this getter to handle null selectedDate
  get filteredTasks(): Task[] {
    if (!this.selectedDate) {
      console.log('No date selected');
      return [];
    }
    
    const filtered = this.tasks.filter(task => {
      const dateStr = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';
      if (this.selectedFilter === 'created') {
        return this.datePipe.transform(task.createdDate, 'yyyy-MM-dd') === dateStr;
      } else {
        return this.datePipe.transform(task.deadline, 'yyyy-MM-dd') === dateStr;
      }
    });
    
    console.log('Filtered tasks:', filtered);
    return filtered;
  }
  // ... rest of your methods remain the same
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'done': return 'check_circle';
      case 'in-progress': return 'hourglass_empty';
      default: return 'radio_button_unchecked';
    }
  }
}