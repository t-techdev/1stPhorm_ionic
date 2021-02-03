import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserPreferencesService } from '../../../../services/user-preferences.service';
import { Transphormer } from '../../../../interfaces';

@Component({
  selector: 'app-portion-control-macros',
  templateUrl: './portion-control-macros.component.html',
  styleUrls: ['./portion-control-macros.component.scss'],
})
export class PortionControlMacrosComponent implements OnInit {

  @Input() opened: boolean = null;
  @Input() showHelp = false;
  @Input() transphormer: Transphormer;
  @Output() toggled = new EventEmitter<boolean>();

  public fullHeight: boolean;

  constructor(
    private prefs: UserPreferencesService
  ) {
    if (this.opened !== null) {
      this.fullHeight = this.opened;
    } else {
      this.fullHeight = this.prefs.get('my-macros-opened', false);
    }
  }

  ngOnInit() {}

  toggle() {
    this.fullHeight = !this.fullHeight;
    this.toggled.emit(this.fullHeight);
    this.prefs.set('my-macros-opened', this.fullHeight);
  }
}
