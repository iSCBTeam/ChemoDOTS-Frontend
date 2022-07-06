import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  //Navigate to the growing
  on_click_Growing() {
    this.router.navigateByUrl('Growing');
  }

  //Navigate to the linking
  on_click_Linking() {
    this.router.navigateByUrl('/Linking');
  }


}
