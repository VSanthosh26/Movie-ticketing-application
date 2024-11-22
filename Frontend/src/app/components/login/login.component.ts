import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import ValidateForm from '../../helpers/validateform';
import { NgToastService, ToasterPosition } from 'ng-angular-popup';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  
  constructor(private fb:FormBuilder, private auth:AuthService, private router:Router,private toast:NgToastService){}
  ngOnInit(): void {
    this.loginForm=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    });
    
  }

  hideShowPass() {
    this.isText = !this.isText; // Toggle the isText property
    this.eyeIcon = this.isText ? "fa-eye" : "fa-eye-slash";
    this.type = this.isText ? "text" : "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      // Send the object to the database
      console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          alert(res.message);
          this.auth.storeToken(res.token);
          this.loginForm.reset();
          this.toast.success("Enjoy watching the movies with Moviemate","Login Success",5000);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          // alert(err?.error.message);
          // this.toast.danger("ERROR", "Something went wrong",5000);
          this.toast.danger("ERROR", "Something went wrong!", 5000);
          console.log(err);
        }
      });
    }else {
      // Throw an error using toaster and highlight required fields
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Your form is invalid");
    }
  } 
}
