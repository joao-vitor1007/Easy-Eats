import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule],
  standalone: true
})
export class Login {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/novo-pedido']);
  }

}