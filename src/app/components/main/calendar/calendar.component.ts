// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';

// interface CalendarDay {
//   date: number;
//   isCurrentMonth: boolean;
//   isToday: boolean;
//   isSelected: boolean;
// }

// @Component({
//   selector: 'app-calendar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css']
// })
// export class CalendarComponent implements OnInit {
//   currentDate: Date = new Date();
//   selectedDate: Date | null = null;
//   calendarDays: CalendarDay[] = [];
  
//   monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
  
//   dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

//   constructor() {}

//   ngOnInit(): void {
//     this.generateCalendar();
//   }

//   get currentMonthYear(): string {
//     const month = this.monthNames[this.currentDate.getMonth()];
//     const year = this.currentDate.getFullYear();
//     return `${month} ${year}`;
//   }

//   generateCalendar(): void {
//     const year = this.currentDate.getFullYear();
//     const month = this.currentDate.getMonth();
    
//     // First day of the month
//     const firstDay = new Date(year, month, 1);
    
//     const lastDay = new Date(year, month + 1, 0);
    
//     const firstDayOfWeek = firstDay.getDay();
    
//     const daysInMonth = lastDay.getDate();
    
//     // Clear previous calendar days
//     this.calendarDays = [];
    
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       const prevMonthDay = new Date(year, month, -(firstDayOfWeek - 1 - i));
//       this.calendarDays.push({
//         date: prevMonthDay.getDate(),
//         isCurrentMonth: false,
//         isToday: false,
//         isSelected: false
//       });
//     }
    
//     // Add days of the current month
//     const today = new Date();
//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDay = new Date(year, month, day);
//       const isToday = this.isSameDay(currentDay, today);
//       const isSelected = this.selectedDate ? this.isSameDay(currentDay, this.selectedDate) : false;
      
//       this.calendarDays.push({
//         date: day,
//         isCurrentMonth: true,
//         isToday,
//         isSelected
//       });
//     }
    
//     // Add days from next month to fill the grid (if needed)
//     const totalCells = Math.ceil(this.calendarDays.length / 7) * 7;
//     const remainingCells = totalCells - this.calendarDays.length;
    
//     for (let day = 1; day <= remainingCells; day++) {
//       this.calendarDays.push({
//         date: day,
//         isCurrentMonth: false,
//         isToday: false,
//         isSelected: false
//       });
//     }
//   }

//   private isSameDay(date1: Date, date2: Date): boolean {
//     return date1.getDate() === date2.getDate() &&
//            date1.getMonth() === date2.getMonth() &&
//            date1.getFullYear() === date2.getFullYear();
//   }

//   previousMonth(): void {
//     this.currentDate.setMonth(this.currentDate.getMonth() - 1);
//     this.generateCalendar();
//   }

//   nextMonth(): void {
//     this.currentDate.setMonth(this.currentDate.getMonth() + 1);
//     this.generateCalendar();
//   }

//   selectDate(day: CalendarDay): void {
//     if (day.isCurrentMonth) {
//       // Clear previous selection
//       this.calendarDays.forEach(d => d.isSelected = false);
      
//       // Set new selection
//       day.isSelected = true;
//       this.selectedDate = new Date(
//         this.currentDate.getFullYear(),
//         this.currentDate.getMonth(),
//         day.date
//       );
//     }
//   }
// }

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  fullDate?: Date;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Output() eventSelected = new EventEmitter<Date>();
  
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  calendarDays: CalendarDay[] = [];
  
  monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  constructor() {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  get currentMonthYear(): string {
    const month = this.monthNames[this.currentDate.getMonth()];
    const year = this.currentDate.getFullYear();
    return `${month} ${year}`;
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    this.calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -(firstDayOfWeek - 1 - i));
      this.calendarDays.push({
        date: prevMonthDay.getDate(),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        fullDate: prevMonthDay
      });
    }
    
    // Add days of the current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const isToday = this.isSameDay(currentDay, today);
      const isSelected = this.selectedDate ? this.isSameDay(currentDay, this.selectedDate) : false;
      
      this.calendarDays.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        fullDate: currentDay
      });
    }
    
    // Add days from next month to fill the grid
    const totalCells = Math.ceil(this.calendarDays.length / 7) * 7;
    const remainingCells = totalCells - this.calendarDays.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonthDay = new Date(year, month + 1, day);
      this.calendarDays.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        fullDate: nextMonthDay
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  selectDate(day: CalendarDay): void {
    if (day.isCurrentMonth) {
      // Clear previous selection
      this.calendarDays.forEach(d => d.isSelected = false);
      
      // Set new selection
      day.isSelected = true;
      this.selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day.date
      );
      
      // Emit the selected date
      this.eventSelected.emit(this.selectedDate);
    }
  }

  getDateAriaLabel(day: CalendarDay): string {
    if (!day.fullDate) return '';
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    let label = day.fullDate.toLocaleDateString('en-US', options);
    
    if (day.isToday) label += ', Today';
    if (day.isSelected) label += ', Selected';
    if (!day.isCurrentMonth) label += ', Other month';
    
    return label;
  }
}