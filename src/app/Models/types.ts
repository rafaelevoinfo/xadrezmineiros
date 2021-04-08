export class Jogador {
    nome: string;
    username: string;
}

export class Torneio {
    id: string;
    nome: string;
    rodadas: number;
    status: number;
    data_inicio: Date;
    jogadores: Jogador[];

    constructor() {
        this.jogadores = [];
        this.status = 0;
    }

    getDescricaoStatus(): string {
        switch (this.status) {
            case 0: return 'Criado';
            case 1: return 'Em andamento';
            default: return 'Finalizado';
        }
    }
}