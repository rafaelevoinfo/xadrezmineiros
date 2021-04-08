import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ɵConsole } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface TabInfo {
  identificador: string,
  checked: boolean;
}

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss'],
})

export class TabItemComponent implements OnInit {
  _checked: boolean;
  _backgroundColorSelected: string;


  @Input() identificador: string;
  @Input() icon: string;
  @Input() iconSelected: string;
  @Input() label: string;
  @Input() set checked(value: boolean) {
    this._checked = value;
    //console.log(this.identificador, this._checked);
    this.update();
  }
  @Input() set backgroundColorSelected(value: string) {
    this._backgroundColorSelected = value;
  }

  @Output() onChange = new EventEmitter<TabInfo>();
  @ViewChild('inputRadio', { read: ElementRef }) input: ElementRef;

  get checked(): boolean {
    return this._checked;
  }

  get backgroundColorSelected(): string {
    return this._backgroundColorSelected;
  }

  constructor() {

  }

  ngOnInit() {

  }

  update() {
    if (!environment.production) {
      console.log('Atualizando icone do identificador', this.identificador, this.checked);
    }

    // if ((this.input) && (this.input.nativeElement)) {
    //   if (!this._checked) {
    //     this.input.nativeElement.style = `content: url(${this.icon});`
    //   } else {
    //     this.input.nativeElement.style = `content: url(${this.iconSelected});`
    //   }
    // }
  }

  ngAfterViewInit() {
    // this.input.nativeElement.style = `content: url(${this.icon});`
  }

  change(event) {
    if (!environment.production) {
      console.log('Item clicado', this.identificador);
    }
    this.onChange.emit({
      identificador: this.identificador,
      checked: event.target.checked
    });
  }



}
