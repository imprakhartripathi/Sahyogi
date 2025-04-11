import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone:false,
  templateUrl: './notifications.module.html',
  styleUrls: ['./notifications.module.scss']
})
export class NotificationsComponent {
  showNotification = true;

  closeNotification() {
    this.showNotification = false;
  }
}

@NgModule({
  declarations: [NotificationsComponent],
  imports: [CommonModule],
  exports: [NotificationsComponent]
})
export class NotificationsModule {}
