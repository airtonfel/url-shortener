import { config } from '../config/Constants';
import { Request, Response } from "express";
import shortId from 'shortid';
import { URLModel } from '../database/model/URL';

export class URLController {
    public async shorten(req:Request, response: Response): Promise<void> {
        //VERIFICAR SE A URL JÁ NÃO EXISTE
        const { originURL } = req.body;
        const url = await URLModel.findOne({ originURL })
        if (url)
        {
            response.json(url)
            return;
        }
        //CRIAR O HASH PRA ESSA URL
        const hash = shortId.generate();
        const shortURL = `${config.API_URL}/${hash}`;
        //SALVAR A URL NO BANCO DE DADOS
        const newURL = await URLModel.create({ hash, originURL, shortURL });
        //RETORNAR A URL SALVA
        response.json(newURL);
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        //PEGAR HASH DA URL
        const { hash } = req.params;
        const url = await URLModel.findOne({ hash });
        if(url) {
            response.redirect(url.originURL);
            return;
        }
        response.status(400).json({error: 'URL not found'});

    }
} 