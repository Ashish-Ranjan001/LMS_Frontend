import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../../services/User/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.editUserForm = this.fb.group({
        name: [user.name, [Validators.required, Validators.minLength(3)]],
        email: [user.email, [Validators.required, Validators.email]],
        phone: [user.phone, [Validators.required, Validators.pattern('^\\d{10}$')]]
      });
    });
  }

  saveUser(): void {
    if (this.editUserForm.valid) {
      this.userService.updateUser(this.userId, this.editUserForm.value).subscribe(() => {
        console.log('User updated successfully!');
      });
    }
  }
}