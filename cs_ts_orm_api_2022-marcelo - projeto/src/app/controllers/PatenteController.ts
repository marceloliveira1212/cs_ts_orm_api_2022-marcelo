import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Patente from '../models/Patente';

class PatenteController {

    async list(req: Request, res: Response) {
        const repository = getRepository(Patente);
        const lista = await repository.find();
        return res.json(lista);
    }

    async store(req: Request, res: Response) {

        const repository = getRepository(Patente);//recupera o repositorio da Patente.

        console.log(req.body);//imprime na saida padrão a mensagem recebida. Isso é apenas para teste...

        const { id } = req.body;//extrai os atributos id do corpo da mensagem.

        const patenteExists = await repository.findOne({ where: { id } });//consulta na tabela se existe um registro com o mesmo id da mensagem.

        if (patenteExists) {

            return res.sendStatus(409);//caso exista um registro, retorna 409 informando o conflito

        }

        const p = repository.create(req.body);//cria a entidade Patente.

        await repository.save(p);//efetiva a operacao de insert.

        return res.json(p);//retorna o bojeto json no response.

    }

    async delete(req: Request, res: Response) {

        const repository = getRepository(Patente);//recupera o repositorio da Patente.

        const { id } = req.body;//extrai os atributos id do corpo da mensagem.

        const patenteExists = await repository.findOne({ where: { id } });//consulta na tabela se existe um registro com o mesmo id da mensagem.

        if (patenteExists) {

            await repository.remove(patenteExists);//caso exista, então aplica a remocao fisica. (corrigir erro no pdf 11)
            return res.sendStatus(204);//retorna o coigo 204.

        } else {

            return res.sendStatus(404);//se nao encontrar jogador para remover, retorna o codigo 404.
        }
    }

    async update(req: Request, res: Response) {

        const repository = getRepository(Patente);//recupera o repositorio do jogador.

        const { id } = req.body;//extrai os atributos id e endereco do corpo da mensagem.

        const patenteExists = await repository.findOne({ where: { id } });//consulta na tabela se existe um registro com o mesmo id da mensagem.

        if (!patenteExists) {
            return res.sendStatus(404);
        }

        const p = repository.create(req.body); //cria a entidade Jogador

        await repository.save(p); //persiste (update) a entidade na tabela.

        return res.json(p);
    }

    async find(req: Request, res: Response) {
        const repository = getRepository(Patente);
        const { id } = req.body;
        const end = await repository.findOne({ where: { id } });

        if (end) {
            return res.json(end);
        } else {
            return res.json(end);
        }
    }
}
export default new PatenteController();