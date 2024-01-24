import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var Tawk_API: any = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = './assets/js/kit-tawk.js'
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }    
    })();
  }

}
