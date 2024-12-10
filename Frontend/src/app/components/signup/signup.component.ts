import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;

  constructor(private fb:FormBuilder,private router:Router, private toast:NgToastService,private auth:AuthService){}

  ngOnInit() {
    this.signUpForm = this.fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      userName : ['', Validators.required],
      email : ['', [Validators.required,Validators.email]],
      password : ['', Validators.required]
   })
  }

  hideShowPass() {
    this.isText = !this.isText; // Toggle the isText property
    this.eyeIcon = this.isText ? "fa-eye" : "fa-eye-slash";
    this.type = this.isText ? "text" : "password";
  }

  onSignup() {
    if (this.signUpForm.valid) {
      // Perform logic for signup
      console.log(this.signUpForm.value);
  
      this.auth.signUp(this.signUpForm.value).subscribe({
        next: (res) => {
          //alert(res.message)
          this.toast.success("Successful registered","User Added",5000);
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          alert(err?.error.message);
          console.log(err);
          // Handle errors as needed
        }
      });
      //console.log(this.signUpForm.value)
    } else {
      // Logic for throwing errors
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }

  
}
