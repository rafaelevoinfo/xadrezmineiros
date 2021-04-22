import { Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { stringify } from 'querystring';
import { TabInfo, TabItemComponent } from '../tab-item/tab-item.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit {
  @ContentChildren(TabItemComponent) tabItens!: QueryList<TabItemComponent>;
  @ViewChild('divRadioGroup', { read: ElementRef }) radioGroup: ElementRef;
  _backgroundColor = "white";
  _activeIdentificador = '';

  @Input() backgroundColorSelected: string;
  @Input() set backgroundColor(value: string) {
    this._backgroundColor = value;
    this.updateBackgroundColor();
  }

  @Output() tabChanged = new EventEmitter<string>();

  @Input() set activeIdentificador(value: string) {
    this._activeIdentificador = value;
    this.updateActiveTab();
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.updateBackgroundColor();
    this.updateActiveTab();
    this.tabItens.changes.subscribe(tabs => {
      if (!environment.production) {
        console.log('Qtde de itens alterada');
      }
      this.captureTabChange();
      this.updateActiveTab();
    });
    this.captureTabChange();
  }

  captureTabChange() {
    for (const vaTabItem of this.tabItens) {
      vaTabItem.onChange.subscribe((ipTab: TabInfo) => {
        if (!environment.production) {
          console.log('Tab bar notificado de item clicado', ipTab.identificador);
        }
        this.activeIdentificador = ipTab.identificador;
      });
    }
  }

  updateActiveTab() {
    if (this.tabItens) {
      for (const vaInnerTab of this.tabItens) {
        vaInnerTab.checked = vaInnerTab.identificador == this._activeIdentificador;
        vaInnerTab.backgroundColor = this.backgroundColor;
        vaInnerTab.backgroundColorSelected = this.backgroundColorSelected;
      }
      this.tabChanged.emit(this._activeIdentificador);
    }
  }


  updateBackgroundColor() {
    if ((this.radioGroup) && (this.radioGroup.nativeElement)) {
      this.radioGroup.nativeElement.style = `background: ${this.backgroundColor};`
    }
  }

}
