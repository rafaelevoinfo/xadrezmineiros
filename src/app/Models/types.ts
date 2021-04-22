export class Jogador {
    nome: string;
    username: string;
    rating?: number;
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
    ritmo_minutos: number;
    ritmo_incremento: number;

    constructor() {
        this.jogadores = [];
        this.rodadas = [];
        this.status = -1;
        this.rodada_atual = -1;
    }

    get finalizado(): boolean {
        return this.status == 2;
    }

    get ritmo(): string {
        if (this.ritmo_minutos) {
            if (this.ritmo_incremento) {
                return this.ritmo_minutos.toString + '+' + this.ritmo_incremento.toString
            } else {
                return this.ritmo_minutos.toString + '+0'
            }
        } else {
            return '';
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