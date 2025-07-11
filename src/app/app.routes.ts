import { Routes } from '@angular/router';
import {PeopleComponent} from './pages/people/people.component';
import {HelpComponent} from './pages/help/help.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {AdministrationComponent} from './pages/administration/administration.component';
import {ProjectsComponent} from './pages/projects/projects.component';
import {TrainingComponent} from './pages/training/training.component';
import {TimesheetComponent} from './pages/timesheet/timesheet.component';
import {LayoutComponent} from './layout/layout.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', component: PeopleComponent},
      {path: 'help', component: HelpComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'administration', component: AdministrationComponent},
      {path: 'projects', component: ProjectsComponent},
      {path: 'training', component: TrainingComponent},
      {path: 'timesheet', component: TimesheetComponent},
      {path: 'calendar', component: CalendarComponent},
    ]
  },

];
