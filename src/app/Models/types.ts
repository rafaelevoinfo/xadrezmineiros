export class Torneio {
    nome: string;
    status: number;

    constructor() {

    }
    getDescricaoStatus(): string {
        if (this.status == 0) {
            return 'Em andamento'
        } else {
            return 'Finalizado'
        }
    }
}