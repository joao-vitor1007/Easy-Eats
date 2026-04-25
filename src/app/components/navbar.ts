import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  constructor(private router: Router) {}

  acessarRota(rota: string): void {
    this.router.navigate([rota]);
  }
}
