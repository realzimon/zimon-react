import {Component} from '@angular/core';
import {Zivi, ZiviService} from '../../services/zivi.service';
import {TimerService} from "../../services/timer.service";

@Component({
  selector: 'zivilist',
  templateUrl: 'app/dash/zivi/zivi-list.component.html',
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class ZiviListComponent {

  zivis: Zivi[];
  remainingMins: number;
  remainingSecs: number;
  loadFlag: boolean = false;

  constructor(private ziviService: ZiviService, private timerService: TimerService) {
    this.loadZivis();
    timerService.getTimerUpdates().subscribe((data: any) => {
      if(this.loadFlag){
        this.loadFlag = false;
        this.loadZivis();
      }
      if(data.remaining === 0){
        this.loadFlag = true;
      }
      this.remainingMins = ~~(data.remaining / 60);
      this.remainingSecs = data.remaining % 60;
    });
  }

  loadZivis(){
    this.ziviService.getAllZivis().subscribe(zivis => {
      this.zivis = zivis;
    });
  }


  handleKeyboardEvent(event: KeyboardEvent) {
    // The lowercase letter 'm' for mexican mode
    if (event.keyCode === 77) {
      this.zivis.forEach((zivi) => {
        let temp = zivi.name;
        zivi.name = zivi.name_mx;
        zivi.name_mx = temp;
      })
    }
  }
}
