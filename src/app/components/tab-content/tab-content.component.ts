import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss'],
})
export class TabContentComponent implements OnInit {
  _active:boolean=false;

  @Input() identificador:string;  
  @ViewChild('div', {read:ElementRef}) div:ElementRef;  
  @Input() set active(value:boolean){
    this._active = value;    
  }

  get classes():string{
    if (this._active){
      return 'conteudo-aba active'
    }else{
      return 'conteudo-aba inactive'
    }
  }

  get active():boolean{
    return this._active;
  }

  constructor() { }

  ngOnInit() {}

}
