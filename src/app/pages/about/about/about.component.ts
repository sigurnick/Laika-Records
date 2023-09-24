import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {


  @ViewChild('audio') audio!: ElementRef;



  isOnSection2:boolean = false;
  isOnSection3:boolean = false;
  isAudioMuted:boolean = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }



  // ngOnInit() {
  //   // Aggiungi l'event listener quando il componente è inizializzato
  //   window.addEventListener('wheel', this.handleWheelEvent, { passive: false });
  // }

  // ngOnDestroy() {
  //   // Rimuovi l'event listener quando il componente viene distrutto
  //   window.removeEventListener('wheel', this.handleWheelEvent);
  // }

  // handleWheelEvent(event: WheelEvent) {
  //   event.preventDefault();
  //   // Implementa la logica di scorrimento personalizzato qui
  // }







  // @HostListener('window:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   // Disabilita lo scroll con le frecce su e giù sulla tastiera
  //   if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
  //     event.preventDefault();
  //   }
  // }


scrollToSection2() {
  const section2 = this.elementRef.nativeElement.querySelector('#section2'); //riferimento section2
  section2.scrollIntoView({ behavior: 'smooth' }); //scroll to section
  this.isOnSection2 = true;

}

scrollToSection3() {
  this.isOnSection3 = true
  const section3 = this.elementRef.nativeElement.querySelector('#section3'); //riferimento section3
  section3.scrollIntoView({ behavior: 'smooth' }); //scroll to section

}


scrollToSection1() {
  const section1 = this.elementRef.nativeElement.querySelector('#section1'); //riferimento section2
  section1.scrollIntoView({ behavior: 'smooth' }); //scroll to section

}

muteAudio() {
  const audioElement: HTMLAudioElement = this.audio.nativeElement;
    audioElement.muted = true;
    this.isAudioMuted = true;
}

unmuteAudio() {
  const audioElement: HTMLAudioElement = this.audio.nativeElement;
  audioElement.muted = false;
  this.isAudioMuted = false
}

}
