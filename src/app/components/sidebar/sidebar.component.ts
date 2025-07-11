import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    SvgIconComponent,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    {
      label: 'Dashboard',
      route: 'dashboard',
      icon: 'dashboard',
      link: '/dashboard',
    },
    {
      label: 'People',
      route: 'people',
      icon: 'people',
      link: '',
    },
    {
      label: 'Project',
      route: 'projects',
      icon: 'projects',
      link: '/projects',
    },
    {
      label: 'Calendar',
      route: 'calendar',
      icon: 'calendar',
      link: '/calendar',
    },
    {
      label: 'Training',
      route: 'training',
      icon: 'training',
      link: '/training',
    },
    {
      label: 'Timesheet',
      route: 'timesheet',
      icon: 'timesheet',
      link: '/timesheet',
    },
    {
      label: 'Reports',
      route: 'reports',
      icon: 'reports',
      link: '/reports',
    },
    {
      label: 'Administration',
      route: 'administration',
      icon: 'administration',
      link: '/administration',
    },
    {
      label: 'Help',
      route: 'help',
      icon: 'help',
      link: '/help',
    },
  ]
}
