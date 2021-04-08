import { Component, ContentChild, ContentChildren, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TabBarComponent } from '../tab-bar/tab-bar.component';
import { TabContentComponent } from '../tab-content/tab-content.component';
@Component({
  selector: 'app-tab-control',
  templateUrl: './tab-control.component.html',
  styleUrls: ['./tab-control.component.scss'],
})
export class TabControlComponent implements OnInit {
  //ContentChild e ContentChildren pega componentes dentro do ng-content, ViewChild e ViewChildren pega fora do ng-content
  @ContentChild(TabBarComponent) tabBar!: TabBarComponent;
  @ContentChildren(TabContentComponent, { descendants: true }) tabsContent!: QueryList<TabContentComponent>;
  _backgroundColor: string = "white";

  constructor() { }

  @Input() set backgroundColor(value: string) {
    this._backgroundColor = value;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.tabBar) {
      this.tabBar.tabChanged.subscribe(ipIdentificador => {
        for (const vaTabContent of this.tabsContent) {
          vaTabContent.active = vaTabContent.identificador == ipIdentificador;
        }
      })
    }
  }

  setActive(ipIdentificador: string) {
    this.tabBar.activeIdentificador = ipIdentificador;
  }

}
