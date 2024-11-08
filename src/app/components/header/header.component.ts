import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit, CommonModule {

  constructor(private cookieService: CookieService) { }

  // Session timer variable will stor the date from the cookie
  sessionTimer: string = "";
  currentTime: string = "";
  countSetPoint: number = 15;

  @ViewChild('circle') circle: ElementRef | undefined;
  clipPath: string =  "";

  ngAfterViewInit(): void {
		const countdown = this.circle?.nativeElement;
    this.sessionTimer = this.cookieService.get('sessionTimer');
    this.currentTime = new Date().toISOString();
    this.animateClipPath(countdown);
	}

  minutes: number = this.countSetPoint;
  seconds: number = 60;
  minutesUntilTimeout: number = this.countSetPoint;
  secondsUntilTimeout: number = 60;

	animateClipPath(element: HTMLElement) {
	
		const top = 60 * this.countSetPoint;
		const cutPoint50 = 50 * this.countSetPoint;
		const cutPoint40 = 40 * this.countSetPoint;
		const cutPoint30 = 30 * this.countSetPoint;
		const cutPoint20 = 20 * this.countSetPoint;
		const cutPoint10 = 10 * this.countSetPoint;

		const animate = () => {

      this.minutesUntilTimeout = Math.floor((Date.parse(this.sessionTimer) - Date.now()) / 1000 / 60);
      this.secondsUntilTimeout = Math.floor((Date.parse(this.sessionTimer) - Date.now()) / 1000 % 60);

			const timer = this.minutesUntilTimeout * 60 + this.secondsUntilTimeout;
			
			if(timer >= cutPoint50 ) {
				this.clipPath = `polygon(0% ${50 + this.percent(timer,top,cutPoint50)}%, 0% 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0%, 50% 0%, 50% 50%)`;      
			} else if (timer >= cutPoint40) {
				this.clipPath = `polygon(${0 + this.percent(timer,cutPoint50,cutPoint40)}% 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0%, 50% 0%, 50% 50%)`;        
			} else if (timer >= cutPoint30) {
				this.clipPath = `polygon(${50 + this.percent(timer,cutPoint40,cutPoint30)}% 100%, 100% 100%, 100% 50%, 100% 0%, 50% 0%, 50% 50%)`;
			} else if (timer >= cutPoint20) {
				this.clipPath = `polygon(100% ${100 - this.percent(timer,cutPoint30,cutPoint20)}%, 100% 50%, 100% 0%, 50% 0%, 50% 50%)`;
			} else if (timer >= cutPoint10) {
				this.clipPath = `polygon(100% ${50 - this.percent(timer,cutPoint20,cutPoint10)}%, 100% 0%, 50% 0%, 50% 50%)`;
			} else {
				this.clipPath = `polygon(${100 - this.percent(timer,cutPoint10,0)}% 0%, 50% 0%, 50.0000000001% 50.0000000001%)`;
			}
		
			element.style.clipPath = this.clipPath;
		
			if (timer < top) {
				requestAnimationFrame(animate);
			}
		};
	
    if (this.minutesUntilTimeout > 0 && this.secondsUntilTimeout > 0) {
		  animate();
    } else {
      this.clipPath = `polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)`;
      this.minutesUntilTimeout = 0;
      this.secondsUntilTimeout = 0;
    }

	}
	
	percent(timer:number, topNum:number, bottomNum:number) {
		return (50*(1-((timer-bottomNum)/(topNum-bottomNum))));
	}

}
