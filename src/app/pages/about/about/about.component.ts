import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit{


  @ViewChild('audio') audio!: ElementRef;



  isOnSection2:boolean = false;
  isOnSection3:boolean = false;
  isAudioMuted:boolean = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2){ }



ngAfterViewInit() {
  const audioElement: HTMLAudioElement = this.audio.nativeElement;
  audioElement.volume = 0.2
}

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
