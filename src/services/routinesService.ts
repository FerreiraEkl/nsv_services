import configCron from "../config/configCron";
import documentController from "../controllers/documentController";
import itemController from "../controllers/itemController";

class RoutinesService {

    constructor() { }

    // INSERIR ABAIXO TODAS AS TAREFAS QUE DEVEM SER AUTOMATIZADAS VIA CRON

    public start() {

        configCron.daylyExecution(() => {
            // VERIFICA AS ORDENS QUE FORAM CONFIRMADAS NO NSV E NÃO NO SAP
            documentController.checkConfirmedOrders().then(() => {
                var date = new Date();
                console.log('cron message: verificação automática de ordens confirmadas \ncron time:' + date.toISOString());
            });
        });

        configCron.tenMinutes(() => {
            // NOTIFICAÇÕES
            documentController.confirmedOrdersNotifications().then(() => {
                var date = new Date();
                console.log('cron message: Emissão automática de notificações de ordens \ncron time:' + date.toISOString());
            });
            
            documentController.confirmedClaimNotifications().then(() => {
                var date = new Date();
                console.log('cron message: Emissão automática de notificações de claims \ncron time:' + date.toISOString());
            });

            // IMPORTAR DOCUMENTOS
            documentController.importClaimFromSap().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de CLAIMS do SAP \ncron time:' + date.toISOString());
            });
            documentController.importOfferFromEasy().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de OFERTAS DO EASY \ncron time:' + date.toISOString());
            });
            documentController.importOfferFromSap().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de OFERTAS DO SAP \ncron time:' + date.toISOString());
            });
            documentController.importConfirmedOrdersFromSap().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de ORDENS CONFIRMADAS DO SAP \ncron time:' + date.toISOString());
            });
            documentController.importApprovalOrdersFromSap().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de ORDENS DE APROVAÇÃO DO SAP \ncron time:' + date.toISOString());
            });

            // IMPORTAR ITENS
            itemController.importOfferItemsFromEasy().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de itens de OFERTAS do EASY \ncron time:' + date.toISOString());
            });
            itemController.importOrderItemsFromSap().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de itens de ORDENS do SAP \ncron time:' + date.toISOString());
            });
            itemController.importOfferItemsFromSap().then(() => {
                var date = new Date();
                console.log('cron message: importação automatica de itens de OFERTAS do SAP \ncron time:' + date.toISOString());
            });
        });
    }

    public test() {
    }
}

export default new RoutinesService()