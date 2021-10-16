export const TIPO_TORNEIO_SUICO = 0;
export const TIPO_TORNEIO_ROBIN = 1;

export class Jogador {
    nome: string;
    username: string;
    rating?: number;
    pontos?:number;

    constructor(){
        this.pontos = 0;
    }
}

export class Partida {
    jogadorBrancas: Jogador;
    jogadorNegras: Jogador;
    resultado: string;
    link: string;
}

export class Rodada {
    numero: number;
    partidas: Partida[];
    data_inicio: Date;

    constructor() {
        this.partidas = [];
    }
}

export class Torneio {
    id: string;
    nome: string;
    qtde_rodadas: number;
    status: number;
    data_inicio: Date;
    jogadores: Jogador[];
    rodadas: Rodada[];
    rodada_atual: number;
    ritmo: string;
    tipo_acesso:number;
    tipo:number;
    descricao:string;

    ganhadores:Jogador[];

    constructor() {
        this.jogadores = [];
        this.rodadas = [];
        this.status = -1;
        this.rodada_atual = -1;
        this.tipo = TIPO_TORNEIO_SUICO;
    }

    get finalizado(): boolean {
        return this.status == 2;
    }

    get descricao_tipo_acesso():string{
        if (this.tipo_acesso == 0){
            return 'Aberto ao público'
        }else{
            return 'Somente convidados';
        }
    }

    getDescricaoStatus(): string {
        switch (this.status) {
            case 0: return 'Criado';
            case 1: return 'Em andamento';
            default: return 'Finalizado';
        }
    }
}