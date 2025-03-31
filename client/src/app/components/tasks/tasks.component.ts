import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  ngOnInit(): void {
      console.log("Hello")
  }
}
