import {app, setup} from "../../index"
import { afterAll, describe, test } from "@jest/globals";
import supertest from "supertest";
import { getConnection } from "typeorm"

describe("persistence test", () => {

    afterAll(async () => {
        await getConnection().close()

    });
    beforeAll(async () => {
        await setup()
    });

    
    test ('teste /endereco/list e /endereco/delete', async () => {

        var agent = supertest(app);
        const postList = await agent.post('/endereco/list');
        expect(postList.statusCode).toEqual(200);
        if (postList.body.length > 0) {

            for (const e of postList.body) {
                //console.log(e);
                const data = { "id": e.id };
                const postDelete = await agent.post('/endereco/delete').send(data);
                expect(postDelete.statusCode).toEqual(204);
            }

        } else {
            const data = { "cep": "Endereco de testes", "complemento": "402" };
            const postCreate = await agent.post('/endereco/store').send(data);
            expect(postCreate.statusCode).toEqual(200);
        }

    });
    test('teste /jogador/list e /jogador/delete', async () => {

        var agent = supertest(app);
        const ret = await agent.post('/jogador/list');
        expect(ret.statusCode).toEqual(200);

        if (ret.body.length > 0) {
            console.log(`Encontrou ${ret.body.length} jogadores cadastrados.`);

            for (const j of ret.body) {
                //console.log(p);
                const data = { "nickname": j.nickname };
                console.log(`Removendo o jogador ${data.nickname}.`);
                const postDeleteJogador = await agent.post('/jogador/delete').send(data);
                expect(postDeleteJogador.statusCode).toEqual(204);

                //esse remocao pode gerar alguma violacao de chave, caso o endereco esteja sendo referenciado por outro jogador.
                //ou aplicar a estratégia de cascade no ManytoOne
                console.log(`Removendo o endereco ${j.endereco.id}.`);
                const postDeleteEndereco = await agent.post('/endereco/delete').send({ "id": j.endereco.id });
                expect(postDeleteEndereco.statusCode).toEqual(204);
            }

        } else {
            console.log("Não encontrou jogadores cadastrados, cadastrando novo jogador e endereco.");
            
            const postCreateEndereco = await agent.post('/endereco/store').send({ "cep": "99010010" });
            expect(postCreateEndereco.statusCode).toEqual(200);

            const postFindEndereco = await agent.post('/endereco/find').send({ "cep": "99010010" });
            expect(postFindEndereco.statusCode).toEqual(200);

            //console.log(postFindEndereco.body);
            const data = {
                "nickname": "marcelo@gmail.com",
                "senha": "123456",
                "pontos": 10,
                "endereco": postFindEndereco.body
            };
            
            const postCreateJogador = await agent.post('/jogador/store').send(data);
            expect(postCreateJogador.statusCode).toEqual(200);
        }

    });


    test('teste /patente/list e /patente/delete', async () => {
        var agent = supertest(app);
        const postList = await agent.post('/patente/list');
        expect(postList.statusCode).toEqual(200);

        if (postList.body.length > 0) { // A tabela patente possui registros

            for (const p of postList.body) { // Acessa os registros da tabela através de um laço for

                const data = { "id": p.id }; // Pega do id de todas as patentes cadastradas

                //joga na tela todas as informações da patente
                console.log("Encontrou a patente: ");
                console.log(data);

                const postDelete = await agent.delete('/patente/delete').send(data);

                //remoção dos dados dessa tabela.
                console.log("Removeu a patente: ");
                console.log(data);

                expect(postDelete.statusCode).toEqual(204);
            }
        } else {
            //insere novos registros na tb_patente
            const data = { "nome": "Patente de teste", "cor": "laranja" };
            const postCreate = await agent.post('/patente/store').send(data);

            //Mostra a patente cadastrada
            console.log("Cadastrou a patente: ");
            console.log(postCreate);

            expect(postCreate.statusCode).toEqual(200);
        }

    });

});