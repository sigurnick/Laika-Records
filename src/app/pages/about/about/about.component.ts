import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {


  isOnSection2:boolean = false;


  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }


scrollToSection2() {

  const section2 = this.elementRef.nativeElement.querySelector('#section2'); //riferimento section2
  section2.scrollIntoView({ behavior: 'smooth' }); //scroll to section
  this.isOnSection2 = true;

}

}
