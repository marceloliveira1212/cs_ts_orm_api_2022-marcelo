import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Jogador from '../models/Jogador';
import Endereco from '../models/Endereco';
import Patente from '../models/Patente';

class JogadorController {

    async delete(req: Request, res: Response) {
        const repository = getRepository(Jogador);
        const { nickname, endereco } = req.body;
        const nicknameExists = await repository.findOne({ where: { nickname } });

        if (nicknameExists) {
            await repository.remove(nickname);
            return res.sendStatus(204);
        } else {
            return res.sendStatus(404);
        }
    }

    async store(req: Request, res: Response) {

        const repository = getRepository(Jogador);
        const { nickname, endereco } = req.body;
        const nicknameExists = await repository.findOne({ where: { nickname } });

        if (nicknameExists) {
            return res.sendStatus(409);
        }
        if (!endereco) {
            return res.sendStatus(404);
        }
        const j = repository.create(req.body); //cria a entidade Jogador
        await repository.save(j); //persiste a entidade na tabela.
        return res.json(j);
    }
    //código da parte 6
    async update(req: Request, res: Response) {

        const repository = getRepository(Jogador);
        const { nickname, endereco, patentes } = req.body;
        const nicknameExists = await repository.findOne({ where: { nickname } });
        const enderecoExists = await getRepository(Endereco).findOne({ where: { "id": endereco.id } });
        const patenteExists = await getRepository(Patente).findOne({ where: { "id": patentes.id } });//consulta a tabela e ve se já existe

        if (!endereco || !nicknameExists || !enderecoExists || !patenteExists) {
            return res.sendStatus(404);
        }
        const j = repository.create(req.body); //cria a entidade Jogador
        await repository.save(j); //persiste a entidade na tabela.
        return res.json(j);
    }
    async list(req: Request, res: Response) {
        const repository = getRepository(Jogador);
        //realiza um innerjoin para recuperar os dados do endereco de cada jogador.
        //realiza um left joint para trazer os dados da tabela associativa (tb_jogador_patente)
        const lista = await repository.createQueryBuilder('tb_jogador').innerJoinAndSelect("tb_jogador.endereco", "endereco").leftJoinAndSelect("tb_jogador.patentes", "patente").getMany();

        return res.json(lista);
    }
}
export default new JogadorController();