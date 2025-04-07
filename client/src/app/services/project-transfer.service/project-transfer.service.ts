import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectTransferService {
  private projectData: any = null;

  setProject(data: any) {
    this.projectData = data;
    sessionStorage.setItem('selectedProject', JSON.stringify(data)); // optional fallback
  }

  getProject(): any {
    return (
      this.projectData ??
      JSON.parse(sessionStorage.getItem('selectedProject') || 'null')
    );
  }

  clearProject() {
    this.projectData = null;
    sessionStorage.removeItem('selectedProject');
  }
}
