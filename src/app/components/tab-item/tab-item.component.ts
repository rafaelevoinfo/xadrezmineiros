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
  _backgroundColor: string;


  @Input() identificador: string;
  @Input() icon: string;
  @Input() iconSelected: string;
  @Input() label: string;
  @Input() set checked(value: boolean) {
    this._checked = value;
    if (!environment.production) {
      console.log('Atualizando valor checked do indentificador ' + this.identificador);
    }
    this.update();
  }
  @Input() set backgroundColor(value: string) {
    this._backgroundColor = value;
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

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  constructor() {

  }

  ngOnInit() {

  }

  update() {
    if (!environment.production) {
      console.log('Atualizando icone do identificador', this.identificador, this.checked);
    }
  }

  ngAfterViewInit() {
    // this.input.nativeElement.style = `content: url(${this.icon});`
  }

  change(event) {
    if (!environment.production) {
      console.log('Item clicado', this.identificador);
    }

    this.notificarAlteracao(event.target.checked);
  }

  notificarAlteracao(ipChecked) {
    this.onChange.emit({
      identificador: this.identificador,
      checked: ipChecked
    });
  }

  divClick() {
    this.input.nativeElement.checked = !this.input.nativeElement.checked;
    this.notificarAlteracao(this.input.nativeElement.checked);
  }



}
