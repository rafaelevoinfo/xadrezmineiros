import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as ProgressBar from "progressbar.js";
import { Torneio } from 'src/app/Models/types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() torneio:Torneio;

  @ViewChild('grafico') grafico;


  constructor() { }

  ngOnInit() {
  
  }

  ngAfterViewInit() {
    this.desenharGrafico(this.torneio.rodada_atual, this.torneio.qtde_rodadas);
  }

  desenharGrafico(ipValorAtual:number, ipValorMaximo:number) {
    //nao temos acesso ao this dentro da funcao step
    let circle = new ProgressBar.Circle(this.grafico.nativeElement, {
      color: "black",
      duration: 3000,
      easing: "easeInOut",
      from: { color: "#aaa", width: 15 },
      to: { color: "#333", width: 15 },
      strokeWidth: 15,
      trailWidth: 15,
      step: function (to, circle) {  
        //preciso converter circle.value() para uma escala de 0 a ipValorMaximo
        let vaValorEscalaNormal = Math.round(circle.value()*ipValorMaximo);
        circle.setText(`${vaValorEscalaNormal}/${ipValorMaximo}`);

        let vaValorAtualEscala100 = Math.round(circle.value()*100);                     
        //preciso converter ipValorAtual para uma escala de 0 a 100 onde 100 = ipValorMaximo
        let vaValorAtualConvertidoEscala100 = Math.round(100*ipValorAtual/ipValorMaximo);
        if (vaValorAtualEscala100 >= vaValorAtualConvertidoEscala100) {
          circle.stop();
        }
      }
    });

    circle.animate(1);
  }


}
