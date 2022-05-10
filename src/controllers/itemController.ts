const fs = require('fs');

import { Document } from '../schemas/tableSchemas/documentSchema';
import { Item } from '../schemas/tableSchemas/itemSchema';

import util from '../util/util';
import excel from 'exceljs';
import SoapService from '../services/SoapService';

class DocumentController {

    /**IMPORTANTE VOLTAR AQUI E COLOCAR CORREÇÃO PARA QUANDO O ITEM FOR REMOVIDO
     * HOJE APENAS ADICIONA E ATUALIZA QUANDO ITEM REMOVIDO DEVE VERIFICAR
     * PEGAR OS ITEMS EXISTENTES E PROCURAR ENTRE OS NOVOS SE NÃO EXISTIR REMOVER
     */

    // ITEM IMPORTS =====================================================
    /* ITEM IMPORTS FROM OTHER SYSTEMS
    */
    public async importOfferItemsFromEasy() {

        this.getLatestOfferItemEasyFile().then(async filename => {
            const workbook = new excel.Workbook();
            workbook.xlsx.readFile(filename).then(async workbook => {

                const worksheet = workbook.getWorksheet(1);
                worksheet.eachRow(async (row) => {

                    if (util.matchDocument(row.getCell(1).text)) {

                        await Document.findByPk(row.getCell(1).text, {
                            attributes: ["COD_DOC"],
                            include: [
                                {
                                    association: Document.associations.items
                                }
                            ]
                        }).then(async document => {

                            if (document) {

                                // PARSE DATA ================================================
                                const COD_DOC = row.getCell(1).text;
                                const COD_ITEM = parseInt((row.getCell(2).text + '0'));
                                const MATERIAL = parseInt(row.getCell(3).text);
                                const DENOMINACAO = row.getCell(4).text;
                                const QTY = parseInt(row.getCell(5).text);
                                const VALUE = (parseFloat(row.getCell(6).text) || 0);


                                let item = ((document as any).items as Array<Item>).find(item => item.COD_ITEM == COD_ITEM);

                                // SE EXISTIR O ITEM ATUALIZA =============================
                                if (item) {
                                    await item.update({
                                        DENOMINACAO: DENOMINACAO,
                                        QUANTIDADE: QTY,
                                        MATERIAL: MATERIAL,
                                        VALOR: VALUE
                                    });
                                }

                                // SE NÃO EXISTIR CRIA =====================================
                                else {
                                    await Item.create({
                                        COD_DOC: COD_DOC,
                                        COD_ITEM: COD_ITEM,
                                        DENOMINACAO: DENOMINACAO,
                                        QUANTIDADE: QTY,
                                        MATERIAL: MATERIAL,
                                        VALOR: VALUE,
                                        MOTIVO_RECUSA: '',
                                        EX_WORKS: null,
                                        COD_OFERTA: null
                                    });
                                }
                            }
                        });
                    }
                });
            });
        });
    }

    public async importOrderItemsFromSap() {
        this.getLatestOrderItemSapFile().then(async filename => {

            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err) { console.error("Could not open file: %s", err); process.exit(1); }

                var linhas = data.split('\n');
                for (var index = 0; index < linhas.length; index++) {

                    let row = linhas[index].replace(/ /g, '').split('|');
                    let fullRow = linhas[index].split('|');

                    if (util.matchDocument(row[1])) {

                        // PARSE DATA ================================================
                        const COD_DOC = row[1];
                        const COD_ITEM = row[2];
                        const MATERIAL = row[3];
                        const DENOMINACAO = fullRow[4];
                        const QTY = parseInt(row[5]);
                        const EX_WORKS = util.convertDate(row[6]);
                        const MOTIVO_RECUSA = fullRow[7];
                        const VALUE = util.converSapValue(row[8]);

                        await Document.findByPk(COD_DOC, {
                            attributes: ["COD_DOC"],
                            include: [
                                {
                                    association: Document.associations.items
                                }
                            ]
                        }).then(async document => {

                            if (document) {



                                let item = ((document as any).items as Array<Item>).find(item => item.COD_ITEM == COD_ITEM);

                                // SE EXISTIR O ITEM ATUALIZA =============================
                                if (item) {
                                    await item.update({
                                        DENOMINACAO: DENOMINACAO,
                                        QUANTIDADE: QTY,
                                        MATERIAL: MATERIAL,
                                        VALOR: VALUE
                                    });
                                }

                                // SE NÃO EXISTIR CRIA =====================================
                                else {
                                    await Item.create({
                                        COD_DOC: COD_DOC,
                                        COD_ITEM: COD_ITEM,
                                        DENOMINACAO: DENOMINACAO,
                                        QUANTIDADE: QTY,
                                        MATERIAL: MATERIAL,
                                        VALOR: VALUE,
                                        MOTIVO_RECUSA: MOTIVO_RECUSA,
                                        EX_WORKS: EX_WORKS,
                                        COD_OFERTA: null
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });

        /*Document.findAll({
            include: [
                {
                    association: Document.associations.items
                }
            ],
            where: {
                TIPO_DOC: 'ZVEX'
            }
        }).then(orders => {
            for (const order of orders) {
                let sapMaterials = SoapService.getOrderItems(parseInt(order.COD_DOC)).then(materials => {
                    return materials;
                }).catch(err => {
                    console.log(err);
                    return null;
                });

                if (sapMaterials != null) {
                    // PROCURA OS EXISTENTES DENTRE OS NOVOS ====
                }
            }
        })*/
    }

    public async importOfferItemsFromSap() {
        this.getLatestOfferItemSapFile().then(async filename => {

            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err) { console.error("Could not open file: %s", err); process.exit(1); }

                var linhas = data.split('\n');
                for (var index = 0; index < linhas.length; index++) {

                    let row = linhas[index].replace(/ /g, '').split('|');
                    let fullRow = linhas[index].split('|');

                    if (util.matchDocument(row[1])) {

                        await Document.findByPk(row[1], {
                            attributes: ["COD_DOC"],
                            include: [
                                {
                                    association: Document.associations.items
                                }
                            ]
                        }).then(async document => {

                            if (document) {

                                // PARSE DATA ================================================
                                const COD_DOC = row[1];
                                const COD_ITEM = row[2];
                                const MATERIAL = row[3];
                                const DENOMINACAO = fullRow[4];
                                const QTY = parseInt(row[5]);
                                const EX_WORKS = util.convertDate(row[6]);
                                const MOTIVO_RECUSA = fullRow[7];
                                const VALUE = util.converSapValue(row[8]);

                                let item = ((document as any).items as Array<Item>).find(item => item.COD_ITEM == COD_ITEM);

                                // SE EXISTIR O ITEM ATUALIZA =============================
                                if (item) {
                                    await item.update({
                                        DENOMINACAO: DENOMINACAO,
                                        QUANTIDADE: QTY,
                                        MATERIAL: MATERIAL,
                                        VALOR: VALUE
                                    }).then(() => {
                                        if (process.env.NODE_ENV === 'development')
                                            console.log("Item atualizado!", COD_DOC, COD_ITEM);
                                    });
                                }

                                // SE NÃO EXISTIR CRIA =====================================
                                else {
                                    await Item.create({
                                        COD_DOC: COD_DOC,
                                        COD_ITEM: COD_ITEM,
                                        DENOMINACAO: DENOMINACAO,
                                        QUANTIDADE: QTY,
                                        MATERIAL: MATERIAL,
                                        VALOR: VALUE,
                                        MOTIVO_RECUSA: MOTIVO_RECUSA,
                                        EX_WORKS: EX_WORKS,
                                        COD_OFERTA: null
                                    }).then(() => {
                                        if (process.env.NODE_ENV === 'development')
                                            console.log("Item criado!", COD_DOC, COD_ITEM);
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    // JOB FINDERS =======================================================
    /*
    THE FUNCTIONS BELLOW ARE NECESARY TO GET IMPORTS FROM OTHER SYSTEMS ==
    LIKE EASY AND SAP (TO CHANGE THE 'LOCATION_JOBFILE' SET IN .env FILE) 
    */

    private async getLatestOfferItemEasyFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/OFERTA/Item_EASY`;

            fs.readdir(location, (err: any, files: Array<string>) => {
                let lastFileName: string = '';
                let lastModifiedArchive = 0;

                if (err)
                    return reject(err);

                for (const file of files) {
                    var statsObj = fs.statSync(`${location}/${file}`);

                    if (statsObj.birthtime > lastModifiedArchive) {
                        lastModifiedArchive = statsObj.birthtime;
                        lastFileName = file;
                    }
                }

                return resolve(`${location}/${lastFileName}`);
            });
        });
    }

    private async getLatestOrderItemSapFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/ORDEM/Item`;

            fs.readdir(location, (err: any, files: Array<string>) => {
                let lastFileName: string = '';
                let lastModifiedArchive = 0;

                if (err)
                    return reject(err);

                for (const file of files) {
                    var statsObj = fs.statSync(`${location}/${file}`);

                    if (statsObj.birthtime > lastModifiedArchive) {
                        lastModifiedArchive = statsObj.birthtime;
                        lastFileName = file;
                    }
                }

                return resolve(`${location}/${lastFileName}`);
            });
        });
    }

    private async getLatestOfferItemSapFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/OFERTA/Item`;

            fs.readdir(location, (err: any, files: Array<string>) => {
                let lastFileName: string = '';
                let lastModifiedArchive = 0;

                if (err)
                    return reject(err);

                for (const file of files) {
                    var statsObj = fs.statSync(`${location}/${file}`);

                    if (statsObj.birthtime > lastModifiedArchive) {
                        lastModifiedArchive = statsObj.birthtime;
                        lastFileName = file;
                    }
                }

                return resolve(`${location}/${lastFileName}`);
            });
        });
    }
}

export default new DocumentController()