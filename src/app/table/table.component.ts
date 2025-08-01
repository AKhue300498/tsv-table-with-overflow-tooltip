// employee-table.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from './employee.interface';
import { CommonModule } from '@angular/common';
import { LazyOverflowTooltipDirective } from '../tooltip-advance.directive';
import {
  TableVirtualScrollDataSource,
  TableVirtualScrollModule,
} from 'ng-table-virtual-scroll';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { Scroll } from '@angular/router';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatSort,
    CommonModule,
    TableVirtualScrollModule,
    LazyOverflowTooltipDirective,
    CdkVirtualScrollViewport,
    ScrollingModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class EmployeeTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'position',
    'phone',
    'address',
    'status',
    'salary',
    'startDate',
    'notes',
    'actions',
  ];

  dataSource = new TableVirtualScrollDataSource<Employee>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadEmployeeData(): void {
    // Simulate API call with delay
    this.dataSource.data = this.generateMockData(10000);
    this.loading = false;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Pending':
        return 'status-pending';
      case 'On Leave':
        return 'status-on-leave';
      default:
        return '';
    }
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  editEmployee(employee: Employee): void {
    console.log('Edit employee:', employee);
    // Implement edit logic
  }

  deleteEmployee(employee: Employee): void {
    console.log('Delete employee:', employee);
    // Implement delete logic
  }

  private generateMockData(count: number): Employee[] {
    const departments = [
      'Engineering',
      'Marketing',
      'Sales',
      'Human Resources',
      'Finance',
      'Operations',
      'Customer Support',
      'Product Management',
      'Design',
      'Quality Assurance',
    ];

    const positions = [
      'Manager',
      'Senior Developer',
      'Analyst',
      'Coordinator',
      'Specialist',
      'Director',
      'Associate',
      'Principal Engineer',
      'Team Lead',
      'Consultant',
    ];

    const statuses: Employee['status'][] = [
      'Active',
      'Inactive',
      'Pending',
      'On Leave',
    ];

    const firstNames = [
      'John',
      'Jane',
      'Michael',
      'Sarah',
      'David',
      'Lisa',
      'Robert',
      'Emily',
      'James',
      'Ashley',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Rodriguez',
      'Martinez',
    ];

    return Array.from({ length: count }, (_, index) => {
      const firstName = firstNames[index % firstNames.length];
      const lastName =
        lastNames[Math.floor(index / firstNames.length) % lastNames.length];
      const department = departments[index % departments.length];
      const position = positions[index % positions.length];

      return {
        id: index + 1,
        name: `${firstName} ${lastName} with an extremely long full name that definitely overflows`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.with.very.long.email@company-domain-name-that-is-quite-long.com`,
        department,
        position: `${position} of ${department} with extensive responsibilities and additional duties`,
        phone: `+1 (${String(Math.floor(Math.random() * 900) + 100)}) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Cedar'][index % 5]} Street, Building ${Math.floor(Math.random() * 10) + 1}, Suite ${Math.floor(Math.random() * 999) + 100}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][index % 5]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][index % 5]} ${String(Math.floor(Math.random() * 90000) + 10000)}`,
        status: statuses[index % statuses.length],
        salary: Math.floor(Math.random() * 150000) + 50000,
        startDate: new Date(
          2018 + Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28),
        ),
        notes: `This employee has extensive experience in ${department.toLowerCase()} and has been a valuable contributor to various high-impact projects. They have demonstrated exceptional skills in leadership, technical expertise, and cross-functional collaboration over the years. Known for their innovative problem-solving approach and mentoring abilities.`,
        avatar: `https://i.pravatar.cc/40?img=${(index % 70) + 1}`,
      };
    });
  }
}
