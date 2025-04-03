import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  standalone: false,
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent {
  isMenuOpen = false;
  
  // Offers array for the features card grid
  offers = [
    {
      number: '01',
      title: 'AI Prioritization',
      description: 'Automatically prioritize tasks based on urgency, dependencies, and deadlines.'
    },
    {
      number: '02',
      title: 'Advanced Analytics & Insights',
      description: 'AI-powered insights to track productivity, predict task completion, and prevent burnout.'
    },
    {
      number: '03',
      title: 'Progress Tracking',
      description: 'Track the progress of your tasks and projects with ease.'
    }
  ];

  // Testimonials array for user reviews
  testimonials = [
    {
      id: 1,
      quote: "TaskMaster has completely changed the way I manage my tasks. It's intuitive, easy to use, and has helped me stay on top of my work.",
      name: "Sarah Patel",
      role: "Project Manager",
      avatar: "assets/images/avatars/sarah.jpg"
    },
    {
      id: 2,
      quote: "I love how TaskMaster allows me to collaborate with my team. It's made our workflow so much smoother and more efficient.",
      name: "Michael Brown",
      role: "Team Lead",
      avatar: "assets/images/avatars/michael.jpg"
    },
    {
      id: 3,
      quote: "The AI prioritization feature saved me 10+ hours per week. I can't imagine working without TaskMaster now.",
      name: "Jessica Lee",
      role: "Marketing Director",
      avatar: "assets/images/avatars/jessica.jpg"
    }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}