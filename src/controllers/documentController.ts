import { Request, Response } from "express";
const fs = require('fs');

import { Op, Sequelize } from '../config/configSequelize';
import ActiveDirectory from '../config/configActiveDirectory';
import emailService from '../services/emailService';
import excel from 'exceljs';
import util from '../util/util';

import { Revision } from "../schemas/tableSchemas/revisionSchema";
import { CustomerCoordinator } from "../schemas/tableSchemas/custromerCoordinator";
import { IDocument } from '../schemas/interfaces/IDocument';
import { Customer } from "../schemas/tableSchemas/customerSchema";
import { Document } from '../schemas/tableSchemas/documentSchema';
import { Item } from '../schemas/tableSchemas/itemSchema';
import { Project } from "../schemas/tableSchemas/projectSchema";
import { User } from '../schemas/tableSchemas/userSchema';
import { Branch } from "../schemas/tableSchemas/branchSchema";
import { Requester } from "../schemas/tableSchemas/requesterSchema";

interface ISAPDocument {
    documentSalesOrder: string, // ======================== Ordemdevenda: 132888717
    documentType: string, // ============================== Tipodedocumentodevendas: ZVEX
    documentSalesTeam: string, // ========================= Equipedevendas: B84
    documentReceiptAt: Date | null, // ==================== Datadopedido: 01.11.2021
    documentConfirmationAt: Date | null, // =============== DtImplantaçãoOV: 01.11.2021
    documentCustomer: number, // ========================== Emissordaordem: 51594
    documentCustomerName: string, // ====================== Nomedoemissordaordem: DALELEKTRIKMOTORLARI & GCAKT.
    documentRequestNumber: string, // ===================== Nr.Pedido: DALGAKIRAN4100029064
    documentRequestType: string, // ======================= TipodePedido: EASY
    documentStatus: number,// ============================= Statusdousuário: Conf
    documentShippingDate: Date | null, // ================= DatadeRemessa: 25.03.2022
    documentShippingConditionDescription: string, // ====== Denominaçãodacondiçãodeexpedição: MarítimoExportação
    documentShippingBlock: string, // ===================== Bloqueioderemessa:
    documentTotalValue: number, // ======================== Vlrtotalordem: 153, 22
    documentCurrency: string, // ========================== Moeda: EUR
    documentResponsibleSAPCode: number, // ================ Funcion�rioRespons�vel: 6475
    documentCoordinatorSAPCode: number, // ================ Coordenadordevendas: 73117
    documentCreatedAt: Date | null, // ==================== Criadoem(data): 01.11.2021
    documentShippingConditionCode: string // ============== Condi��odeexpedi��o: Z0
}

class DocumentController {

    // GETTERS ==========================================================================================
    public async searchDocuments(req: Request, res: Response): Promise<Response> {
        const { searchString, searchPage, searchSize } = req.body;
        const offset = (searchPage - 1) * searchSize;

        let result = { total: 0, resultSet: new Array<IDocument>() };

        let endFilter: Array<Object> = [];
        endFilter.push({ COD_DOC: { [Op.like]: `%${searchString}%` } });

        return await Document.count({
            where: { [Op.and]: endFilter }
        }).then(async orders => {
            result.total = orders;
            return await Document.findAll({
                offset: offset,
                limit: searchSize,
                subQuery: false,
                attributes: [
                    "TIPO_DOC",
                    "COD_DOC",
                    "VALOR_DOC",
                    "COD_STATUS_DOC",
                    "COD_MOEDA"
                ],
                include: [
                    {
                        association: Document.associations.responsible,
                        required: false,
                        attributes: [
                            "NOME_USU"
                        ]
                    },
                    {
                        association: Document.associations.coordinator,
                        required: false,
                        attributes: [
                            "NOME_USU"
                        ]
                    },
                    {
                        association: Document.associations.items,
                        required: false,
                        attributes: [
                            "COD_ITEM"
                        ]
                    },

                ],
                where: {
                    [Op.and]: endFilter
                }
            }).then(orders => {
                result.resultSet = orders;
                return res.status(200).json(result);
            })
        }).catch(err => {
            console.log(err);
            return res.status(500).json();
        });
    }

    public async confirmedOrdersNotifications() {

        // NOTIFICAÇÕES PARA DOCUMENTOS QUE FORAM CONFIRMADOS E AINDA NÃO EMITIRAM NOTIFICAÇÃO ===============================

        Document.findAll({
            attributes: [
                "COD_DOC",
                "DT_CONF",
                "DT_REGISTRO",
                "ENVIAR_DOC",
                "INSPECAO",
                "LP_AMT",
                "COD_MOTI_NCA",
                "LU",
                "MAT_NOVO",
                "OV_APROV",
                "N_ATD_DT_SLCTD",
                "VALOR_DOC",
                "COD_MOEDA",
                "PED_REF",
                "CMT_DOC"
            ],
            include: [
                {
                    association: Document.associations.offers,
                    attributes: [
                        "COD_DOC",
                        "VALOR_DOC",
                        "COD_MOEDA"
                    ],
                    include: [
                        {
                            association: Document.associations.project,
                            attributes: [
                                "NOME",
                            ],
                            include: [
                                {
                                    association: Project.associations.documents,
                                    attributes: [
                                        "COD_DOC"
                                    ],
                                    include: [{
                                        association: Document.associations.customer,
                                        attributes: [
                                            "NOME_CLI",
                                            "COD_CLI"
                                        ]
                                    }],
                                    where: {
                                        TIPO_DOC: 'ZVCO',
                                        COD_STATUS_DOC: 6
                                    }
                                },
                                {
                                    association: Project.associations.coordinator,
                                    attributes: [
                                        "NOME_USU",
                                        "USU_USU"
                                    ]
                                },
                                {
                                    association: Project.associations.responsible,
                                    attributes: [
                                        "NOME_USU",
                                        "USU_USU"
                                    ]
                                }
                            ],
                        },
                        {
                            association: Document.associations.responsible,
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ]
                        },
                        {
                            association: Document.associations.coordinator,
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ]
                        }
                    ]
                },
                {
                    association: Document.associations.project,
                    attributes: [
                        "NOME",
                    ],
                    include: [
                        {
                            association: Project.associations.coordinator,
                            attributes: [
                                "NOME_USU",
                                "USU_USU"
                            ]
                        },
                        {
                            association: Project.associations.responsible,
                            attributes: [
                                "NOME_USU",
                                "USU_USU"
                            ]
                        }
                    ]
                },
                {
                    association: Document.associations.customer,
                    attributes: [
                        "NOME_CLI",
                        "COD_CLI"
                    ]
                },
                {
                    association: Document.associations.responsible,
                    attributes: [
                        "NOME_USU",
                        "USU_USU"
                    ]
                },
                {
                    association: Document.associations.coordinator,
                    attributes: [
                        "NOME_USU",
                        "USU_USU"
                    ]
                }
            ],
            where: {
                TIPO_DOC: "ZVEX",       // ORDENS
                COD_STATUS_DOC: 4,      // CONFIRMADAS
                documentHasNotification: false, // QUE AINDA NÃO FORAM NOTIFICADAS
            }
        }).then(documents => {

            documents.forEach((doc: any) => {

                // COINTRUÇÃO DA MENSAGEM ===============================================================
                let subjectForOrders = `WMO - NSV Ordem: ${doc.COD_DOC}`;

                let textsForOrders = [
                    `A Ordem ${doc.COD_DOC} foi confirmada.`,
                    `Responsável: ${doc.responsible.NOME_USU}.`,
                    `Valor da ordem: ${util.convertCurrency(doc.VALOR_DOC, doc.COD_MOEDA)}`,
                    `Confirmação da ordem: ${doc.DT_CONF.toLocaleDateString()}.`,
                    `Comentários:${doc.CMT_DOC || ''}`
                ];

                if (doc.customer) {
                    textsForOrders.push(`Cliente: ${doc.customer.NOME_CLI} (${doc.customer.COD_CLI}).`);
                    subjectForOrders += ` Cliente:${doc.customer.NOME_CLI}`
                }

                if (doc.PED_REF)
                    textsForOrders.push(`Referência: ${doc.PED_REF}`);

                if (doc.COD_MOTI_NCA == 15)
                    textsForOrders.push("Ordem não possui motivo de não confirmação automática.");

                if (doc.COD_MOTI_NCA == 10)
                    textsForOrders.push("Motivo de não confirmação automática: Preço não cadastrado!");

                if (doc.ENVIAR_DOC)
                    textsForOrders.push("Enviar documentação? sim.");

                if (doc.INSPECAO)
                    textsForOrders.push("Ordem com inspeção? sim.");

                if (doc.LP_AMT)
                    textsForOrders.push("Protótipo/Lote piloto/Amostra? sim.");

                if (doc.LU)
                    textsForOrders.push("Lote único? sim.");

                if (doc.MAT_NOVO)
                    textsForOrders.push("Foi criado material novo? sim.");

                if (doc.OV_APROV)
                    textsForOrders.push("Aprovação? sim.");

                if (doc.N_ATD_DT_SLCTD)
                    textsForOrders.push("Não atendeu a data solicitada: " + doc.EX_WORKS_DESEJADO?.toLocaleDateString());

                // DOCUMENTOS COM PROJETOS VINCULADOS ======================
                if (doc.project) {
                    textsForOrders.push("<hr>");
                    textsForOrders.push(`Projeto: ${doc.project.NOME}`);
                }

                // DOCUMENTOS COM OFERTAS VINCULADAS =======================
                if (doc.offers.length > 0) {
                    textsForOrders.push('<hr>');
                    textsForOrders.push('<b>Ofertas relacionadas:<b>')

                    for (const offer of doc.offers)
                        textsForOrders.push(`Oferta: ${offer.COD_DOC}`);
                }

                // ===========================================================================
                // DOCUMENTOS COM OFERTAS VINCULADAS =========================================
                if (doc.offers.length > 0) {
                    for (const offer of doc.offers) {
                        const subject = `WMO - NSV Oferta: ${offer.COD_DOC}`;
                        let textsForOffers = [
                            `A oferta ${offer.COD_DOC} foi vendida em uma nova ordem de venda.`,
                            `Ordem: ${doc.COD_DOC}.`,
                            `Cliente: ${doc.customer.NOME_CLI} (${doc.customer.COD_CLI}).`,
                            `Responsável: ${doc.responsible.NOME_USU}.`,
                            `Valor da ordem: ${util.convertCurrency(doc.VALOR_DOC, doc.COD_MOEDA)}`,
                            `Valor da oferta: ${util.convertCurrency(offer.VALOR_DOC, offer.COD_MOEDA)}`,
                            `Confirmação da ordem: ${doc.DT_CONF.toLocaleDateString()}.`
                        ];

                        // NOTIFICAÇÕES PARA OFERTAS QUE POSSUEM PROJETOS ======================================================
                        if (offer.project) {

                            textsForOffers.push(`Projeto: ${offer.project.NOME}`);

                            let textsForProjects = textsForOffers;
                            textsForProjects.push(`<hr>`);

                            if (offer.project.documents.length > 0) {
                                textsForProjects.push(`<b>Outras ofertas para este projeto que ainda não foram vendidas:<b>`);
                                for (const pendingOffer of offer.project.documents) {
                                    textsForProjects.push(`Oferta: ${pendingOffer.COD_DOC} - Cliente: ${pendingOffer.customer.NOME_CLI} (${pendingOffer.customer.COD_CLI})`);
                                }
                            }

                            if (process.env.NODE_ENV === 'production') {
                                if (offer.project.coordinator)
                                    emailService.notify({ user: offer.project.coordinator, subject: subject, texts: textsForProjects });

                                if (offer.project.responsible)
                                    emailService.notify({ user: offer.project.responsible, subject: subject, texts: textsForProjects });
                            }
                        }

                        // NOTIFICAÇÕES AO TIME DE OFERTAS ======================================================================

                        if (process.env.NODE_ENV === 'production') {
                            if (offer.responsible)
                                emailService.notify({ user: offer.responsible, subject: subject, texts: textsForOffers });

                            if (offer.coordinator)
                                emailService.notify({ user: offer.coordinator, subject: subject, texts: textsForOffers });
                        }

                    }

                }

                // ===========================================================================
                // NOTIFICAÇÕES ==============================================================

                if (process.env.NODE_ENV === 'production') {
                    if (doc.coordinator)
                        emailService.notify({ user: doc.coordinator, subject: subjectForOrders, texts: textsForOrders });

                    if (doc.offers.length <= 0 && doc.project && doc.project.coordinator)
                        emailService.notify({ user: doc.project.coordinator, subject: subjectForOrders, texts: textsForOrders });

                    if (doc.offers.length <= 0 && doc.project && doc.project.responsible)
                        emailService.notify({ user: doc.project.responsible, subject: subjectForOrders, texts: textsForOrders });

                    if (doc.INSPECAO) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "valeriop"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    if (doc.LP_AMT) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "fbrondani"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });

                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "kuwano"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    if (doc.COD_MOTI_NCA == 10) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "marlonb"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    // NOTIFICAR ADMINISTRADOR DO SISTEMA QUANDO MOTIVO NCA FOR SEM MOTIVO ======
                    if (doc.COD_MOTI_NCA == 15) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "erikferreira"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    // ATUALIZA O DOCUMENTO PARA QUE O MESMO NÃO REENVIE A NOTIFICAÇÃO ==========
                    doc.update({ documentHasNotification: true });
                }
                else {
                    User.findOne({
                        attributes: [
                            "USU_USU",
                            "NOME_USU"
                        ],
                        where: {
                            USU_USU: "erikferreira"
                        }
                    }).then(user => {
                        if (user)
                            emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                    });
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    public async confirmedClaimNotifications() {

        // NOTIFICAÇÕES PARA DOCUMENTOS QUE FORAM CONFIRMADOS E AINDA NÃO EMITIRAM NOTIFICAÇÃO ===============================

        Document.findAll({
            attributes: [
                "COD_DOC",
                "DT_CONF",
                "DT_REGISTRO",
                "ENVIAR_DOC",
                "INSPECAO",
                "LP_AMT",
                "COD_MOTI_NCA",
                "LU",
                "MAT_NOVO",
                "OV_APROV",
                "N_ATD_DT_SLCTD",
                "VALOR_DOC",
                "COD_MOEDA",
                "PED_REF",
                "CMT_DOC"
            ],
            include: [
                {
                    association: Document.associations.offers,
                    attributes: [
                        "COD_DOC",
                        "VALOR_DOC",
                        "COD_MOEDA"
                    ],
                    include: [
                        {
                            association: Document.associations.project,
                            attributes: [
                                "NOME",
                            ],
                            include: [
                                {
                                    association: Project.associations.documents,
                                    attributes: [
                                        "COD_DOC"
                                    ],
                                    include: [{
                                        association: Document.associations.customer,
                                        attributes: [
                                            "NOME_CLI",
                                            "COD_CLI"
                                        ]
                                    }],
                                    where: {
                                        TIPO_DOC: 'ZVCO',
                                        COD_STATUS_DOC: 6
                                    }
                                },
                                {
                                    association: Project.associations.coordinator,
                                    attributes: [
                                        "NOME_USU",
                                        "USU_USU"
                                    ]
                                },
                                {
                                    association: Project.associations.responsible,
                                    attributes: [
                                        "NOME_USU",
                                        "USU_USU"
                                    ]
                                }
                            ],
                        },
                        {
                            association: Document.associations.responsible,
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ]
                        },
                        {
                            association: Document.associations.coordinator,
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ]
                        }
                    ]
                },
                {
                    association: Document.associations.project,
                    attributes: [
                        "NOME",
                    ],
                    include: [
                        {
                            association: Project.associations.coordinator,
                            attributes: [
                                "NOME_USU",
                                "USU_USU"
                            ]
                        },
                        {
                            association: Project.associations.responsible,
                            attributes: [
                                "NOME_USU",
                                "USU_USU"
                            ]
                        }
                    ]
                },
                {
                    association: Document.associations.customer,
                    attributes: [
                        "NOME_CLI",
                        "COD_CLI"
                    ]
                },
                {
                    association: Document.associations.responsible,
                    attributes: [
                        "NOME_USU",
                        "USU_USU"
                    ]
                },
                {
                    association: Document.associations.coordinator,
                    attributes: [
                        "NOME_USU",
                        "USU_USU"
                    ]
                }
            ],
            where: {
                TIPO_DOC: "ZCLA",               // CLAIM
                COD_STATUS_DOC: 18,             // CONFIRMADOS
                documentHasNotification: false, // QUE AINDA NÃO FORAM NOTIFICADAS
                DT_CONF: { [Op.gt]: new Date('2021/09/20') }
            }
        }).then(documents => {

            documents.forEach((doc: any) => {

                // COINTRUÇÃO DA MENSAGEM ===============================================================
                let subjectForOrders = `WMO - NSV Claim: ${doc.COD_DOC}`;

                let textsForOrders = [
                    `O Claim ${doc.COD_DOC} foi concluído.`,
                    `Responsável: ${doc.responsible.NOME_USU}.`,
                    `Valor do claim: ${util.convertCurrency(doc.VALOR_DOC, doc.COD_MOEDA)}`,
                    `Confirmação do claim: ${doc.DT_CONF.toLocaleDateString()}.`,
                    `Comentários:${doc.CMT_DOC || ''}`
                ];

                if (doc.customer) {
                    textsForOrders.push(`Cliente: ${doc.customer.NOME_CLI} (${doc.customer.COD_CLI}).`);
                    subjectForOrders += ` Cliente:${doc.customer.NOME_CLI}`
                }

                if (doc.PED_REF)
                    textsForOrders.push(`Referência: ${doc.PED_REF}`);

                if (doc.ENVIAR_DOC)
                    textsForOrders.push("Enviar documentação? sim.");

                if (doc.INSPECAO)
                    textsForOrders.push("Ordem com inspeção? sim.");

                if (doc.LP_AMT)
                    textsForOrders.push("Protótipo/Lote piloto/Amostra? sim.");

                if (doc.LU)
                    textsForOrders.push("Lote único? sim.");

                if (doc.MAT_NOVO)
                    textsForOrders.push("Foi criado material novo? sim.");

                if (doc.OV_APROV)
                    textsForOrders.push("Aprovação? sim.");

                // DOCUMENTOS COM PROJETOS VINCULADOS ======================
                if (doc.project) {
                    textsForOrders.push("<hr>");
                    textsForOrders.push(`Projeto: ${doc.project.NOME}`);
                }

                // DOCUMENTOS COM OFERTAS VINCULADAS =======================
                if (doc.offers.length > 0) {
                    textsForOrders.push('<hr>');
                    textsForOrders.push('<b>Ofertas relacionadas:<b>')

                    for (const offer of doc.offers)
                        textsForOrders.push(`Oferta: ${offer.COD_DOC}`);
                }

                // ===========================================================================
                // DOCUMENTOS COM OFERTAS VINCULADAS =========================================
                if (doc.offers.length > 0) {
                    for (const offer of doc.offers) {
                        const subject = `WMO - NSV Oferta: ${offer.COD_DOC}`;
                        let textsForOffers = [
                            `A oferta ${offer.COD_DOC} foi vendida em um novo claim.`,
                            `Claim: ${doc.COD_DOC}.`,
                            `Cliente: ${doc.customer?.NOME_CLI} (${doc.customer?.COD_CLI}).`,
                            `Responsável: ${doc.responsible.NOME_USU}.`,
                            `Valor do claim: ${util.convertCurrency(doc.VALOR_DOC, doc.COD_MOEDA)}`,
                            `Valor da oferta: ${util.convertCurrency(offer.VALOR_DOC, offer.COD_MOEDA)}`,
                            `Conclusão do claim: ${doc.DT_CONF.toLocaleDateString()}.`
                        ];

                        // NOTIFICAÇÕES PARA OFERTAS QUE POSSUEM PROJETOS ======================================================
                        if (offer.project) {

                            textsForOffers.push(`Projeto: ${offer.project.NOME}`);

                            let textsForProjects = textsForOffers;
                            textsForProjects.push(`<hr>`);

                            if (offer.project.documents.length > 0) {
                                textsForProjects.push(`<b>Outras ofertas para este projeto que ainda não foram vendidas:<b>`);
                                for (const pendingOffer of offer.project.documents) {
                                    textsForProjects.push(`Oferta: ${pendingOffer.COD_DOC} - Cliente: ${pendingOffer.customer.NOME_CLI} (${pendingOffer.customer.COD_CLI})`);
                                }
                            }

                            if (process.env.NODE_ENV === 'production') {
                                if (offer.project.coordinator)
                                    emailService.notify({ user: offer.project.coordinator, subject: subject, texts: textsForProjects });

                                if (offer.project.responsible)
                                    emailService.notify({ user: offer.project.responsible, subject: subject, texts: textsForProjects });
                            } else {
                                User.findOne({
                                    attributes: [
                                        "USU_USU",
                                        "NOME_USU"
                                    ],
                                    where: {
                                        USU_USU: "erikferreira"
                                    }
                                }).then(user => {
                                    if (user)
                                        emailService.notify({ user: user, subject: subject, texts: textsForProjects });
                                });
                            }
                        }

                        // NOTIFICAÇÕES AO TIME DE OFERTAS ======================================================================

                        if (process.env.NODE_ENV === 'production') {
                            if (offer.responsible)
                                emailService.notify({ user: offer.responsible, subject: subject, texts: textsForOffers });

                            if (offer.coordinator)
                                emailService.notify({ user: offer.coordinator, subject: subject, texts: textsForOffers });
                        }
                        else {
                            User.findOne({
                                attributes: [
                                    "USU_USU",
                                    "NOME_USU"
                                ],
                                where: {
                                    USU_USU: "erikferreira"
                                }
                            }).then(user => {
                                if (user)
                                    emailService.notify({ user: user, subject: subject, texts: textsForOffers });
                            });
                        }
                    }
                }

                // ===========================================================================
                // NOTIFICAÇÕES ==============================================================

                if (process.env.NODE_ENV === 'production') {
                    if (doc.coordinator)
                        emailService.notify({ user: doc.coordinator, subject: subjectForOrders, texts: textsForOrders });

                    if (doc.offers.length <= 0 && doc.project && doc.project.coordinator)
                        emailService.notify({ user: doc.project.coordinator, subject: subjectForOrders, texts: textsForOrders });

                    if (doc.offers.length <= 0 && doc.project && doc.project.responsible)
                        emailService.notify({ user: doc.project.responsible, subject: subjectForOrders, texts: textsForOrders });

                    if (doc.INSPECAO) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "valeriop"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    if (doc.LP_AMT) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "fbrondani"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });

                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "kuwano"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    if (doc.COD_MOTI_NCA == 10) {
                        User.findOne({
                            attributes: [
                                "USU_USU",
                                "NOME_USU"
                            ],
                            where: {
                                USU_USU: "marlonb"
                            }
                        }).then(user => {
                            if (user)
                                emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                        });
                    }

                    // ATUALIZA O DOCUMENTO PARA QUE O MESMO NÃO REENVIE A NOTIFICAÇÃO ==========
                    doc.update({ documentHasNotification: true });
                }
                else {
                    User.findOne({
                        attributes: [
                            "USU_USU",
                            "NOME_USU"
                        ],
                        where: {
                            USU_USU: "erikferreira"
                        }
                    }).then(user => {
                        if (user)
                            emailService.notify({ user: user, subject: subjectForOrders, texts: textsForOrders });
                    });
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }


    public async checkConfirmedOrders() {
        this.getLatestOrderHeaderSapFile().then(async filename => {

            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err) { console.error("Could not open file: %s", err); process.exit(1); }

                var linhas = data.split('\n');

                for (var index = 0; index < linhas.length; index++) {

                    let row = linhas[index].replace(/ /g, '').split('|');
                    let col: string = row[1];

                    if (util.matchDocument(col)) {
                        if (row[11] != 'Conf') {
                            Document.findOne({
                                attributes: [
                                    "DT_CONF",
                                    "COD_DOC",
                                    "COD_STATUS_DOC"
                                ],
                                include: [
                                    {
                                        association: Document.associations.responsible
                                    }
                                ],
                                where: {
                                    COD_STATUS_DOC: 4,
                                    COD_DOC: col
                                }
                            }).then(document => {
                                if (document)
                                    emailService.orderStatusWarning(document, row);
                            });
                        }
                        else {
                            Document.findOne({
                                attributes: [
                                    "DT_CONF",
                                    "COD_DOC",
                                    "COD_STATUS_DOC"
                                ],
                                include: [
                                    {
                                        association: Document.associations.responsible
                                    }
                                ],
                                where: {
                                    COD_STATUS_DOC: { [Op.not]: 4 },
                                    COD_DOC: col
                                }
                            }).then(document => {
                                if (document)
                                    emailService.orderStatusWarning(document, row);
                            });
                        }
                    }
                }
            });
        });
    }

    private async createOrderFolder(order: IDocument) {
        /* const now = new Date();

        if (!order.DT_RCB_DOC || order.DT_RCB_DOC.getFullYear() > now.getFullYear())
            return;

        //CRIAR DIRETÓRIO DE EMAILS
        const emailDir = `${process.env.LOCATION_ORDERFILE}/${order.DT_RCB_DOC.getFullYear()}/Arquivamento de E-mails/${order.COD_DOC}`;;
        if (!fs.existsSync(emailDir)) {
            fs.mkdirSync(emailDir);
        }

        //CRIAR DIRETÓRIO DE ORDENS
        const orderDir = `${process.env.LOCATION_ORDERFILE}/${order.DT_RCB_DOC.getFullYear()}/Ordens de Vendas/${order.COD_DOC}`;
        if (!fs.existsSync(orderDir)) {
            fs.mkdirSync(orderDir);
        }
*/
    }

    // DOCUMENT IMPORTS ===========================================
    /*
    DOCUMENT IMPORTS FROM OTHER SYSTEMS
    */

    public async importClaimFromSap() {
        this.getLatestClaimHeaderSapFile().then(async filename => {
            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err)
                    console.log(err);

                var linhas = data.split('\n');

                for (var index = 0; index < linhas.length; index++) {

                    let row = linhas[index].replace(/ /g, '').split('|');
                    let fullRow = linhas[index].split('|');

                    // VERIFICA SE A LINHA É UM DOCUMENTO VÁLIDO ==================
                    if (util.matchDocument(row[1])) {

                        // BUSCA RESPONSÁVEL PELO LOGIN ===========================
                        let responsible = await User.findOne({
                            where: { USU_USU: row[8] }
                        }).then(user => {
                            if (!user)
                                return undefined;
                            return user;
                        });

                        // BUSCA OU CRIA O CLIENTE ================================
                        let customer = await Customer.findOrCreate({
                            where: {
                                COD_CLI: row[11]
                            },
                            defaults: {
                                COD_CLI: row[11],
                                NOME_CLI: row[12],
                                CONTINENTE: '',
                                PAIS: '',
                                COD_FILI: ''
                            }
                        }).then(customer => {
                            if (!customer)
                                return undefined;
                            return customer[0];
                        });

                        // BUSCA OS DADOS DO SOLICITANTE NO AD ====================
                        let requester = await ActiveDirectory.getUserData(row[7]).then(adUser => {
                            return adUser;
                        });

                        // BUSCAR FILIAL E SOLICITANTE NA BASE ====================
                        let branch: Branch | undefined;
                        let claimRequester: Requester | undefined;
                        if (requester) {
                            branch = await Branch.findOne({
                                where: {
                                    NOME_FILI: {
                                        [Op.like]: (requester.branch).toUpperCase()
                                    }
                                }
                            }).then(branch => {
                                if (!branch)
                                    return undefined;
                                return branch;
                            });

                            claimRequester = await Requester.findOrCreate({
                                where: {
                                    NOME_SOLI: requester.name
                                },
                                defaults: {
                                    NOME_SOLI: requester.name
                                }
                            }).then(claimRequester => {
                                if (!claimRequester)
                                    return undefined;
                                return claimRequester[0];
                            })
                        }

                        await Document.findByPk(row[1]).then(async document => {
                            // CRIA O CLAIM CASO NÃO EXISTA =======================
                            if (!document) {
                                await Document.create({
                                    COD_DOC: row[1],
                                    TIPO_DOC: 'ZCLA',
                                    VALOR_DOC: 0,
                                    QTD_LINHAS: 1,
                                    DT_REGISTRO: new Date,
                                    DT_RCB_DOC: util.convertDate(row[3]),
                                    DT_CONF: util.convertDate(row[5]),
                                    COD_STATUS_DOC: 18,
                                    MATERIAL: row[10],
                                    COD_MOEDA: branch && branch.COD_MOEDA ? branch.COD_MOEDA : 'USD',
                                    COD_CLI: customer ? customer.COD_CLI : null,
                                    COD_FILI: branch ? branch.COD_FILI : null,
                                    COD_AREA: responsible ? responsible.COD_AREA : null,
                                    COD_RESP: responsible ? responsible.COD_USU : null,
                                    COD_SOLI: claimRequester ? claimRequester.COD_SOLI : null,
                                    CMT_DOC: `NSV - Claim importado automaticamente. \r\n ${fullRow[14]}`
                                });
                            }

                            // ATUALIZA O CLAIM CASO EXISTA =======================
                            else {
                                document.update({
                                    QTD_LINHAS: 1,
                                    DT_REGISTRO: new Date,
                                    DT_RCB_DOC: util.convertDate(row[3]),
                                    DT_CONF: util.convertDate(row[5]),
                                    MATERIAL: row[10],
                                    COD_MOEDA: branch && branch.COD_MOEDA ? branch.COD_MOEDA : 'USD',
                                    COD_CLI: customer ? customer.COD_CLI : null,
                                    COD_FILI: branch ? branch.COD_FILI : null,
                                    COD_AREA: responsible ? responsible.COD_AREA : null,
                                    COD_RESP: responsible ? responsible.COD_USU : null,
                                    COD_SOLI: claimRequester ? claimRequester.COD_SOLI : null,
                                });
                            }
                        });
                    }
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    public async importOfferFromEasy() {
        this.getLatestOfferHeaderEasyFile().then(async filename => {

            const workbook = new excel.Workbook();

            workbook.xlsx.readFile(filename).then(async workbook => {

                const worksheet = workbook.getWorksheet(1);

                worksheet.eachRow(async (row) => {

                    const COD_DOC = row.getCell(3).value?.toString();

                    if (COD_DOC && util.matchDocument(COD_DOC)) {

                        // FILEMAP =================================
                        const DT_SUB = new Date(row.getCell(1).value?.toString() || '');
                        const DT_REC = new Date(row.getCell(2).value?.toString() || '');
                        const REV = (row.getCell(4).value as number) || 0;
                        const COD_CLI = row.getCell(5).text;
                        const COD_RESP = row.getCell(7).text;
                        const COD_COOR = row.getCell(8).text;
                        const CURRENCY = row.getCell(9).text;
                        const VALUE = (parseFloat(row.getCell(10).text) || 0);

                        // SELEÇÃO DO COORDENADOR ==========================
                        let coordinator = await User.findOne({
                            where: { NOME_USU: COD_COOR }
                        }).then(user => {
                            return user;
                        });

                        // SELEÇÃO DO RESPONSAVEL ==========================
                        let responsible = await User.findOne({
                            where: { NOME_USU: { [Op.like]: `${COD_RESP}%` } }
                        }).then(user => {
                            return user;
                        });

                        // SELEÇÃO DO CLIENTE ==============================
                        let customer = await Customer.findByPk(COD_CLI, {
                            include: [
                                {
                                    association: Customer.associations.coordinators,
                                    required: false,
                                    include: [
                                        {
                                            // DEVE SER COORDENADOR DE OFERTA
                                            association: CustomerCoordinator.associations.coordinator,
                                            where: {
                                                TIPO_COOR: [
                                                    "COFE",// coordenador de ofertas
                                                    "COEO" // coordenador de ordem e ofertas
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ]
                        }).then(customer => {
                            return customer;
                        });

                        // CASO O COORDENADOR NÃO SEJA INFORMADO ===========
                        // USAR O PADRÃO DO CLIENTE ========================
                        if (!coordinator)
                            coordinator = (customer as any).coordinators[0] ? (customer as any).coordinators[0].coordinator : null;

                        await Document.findByPk(COD_DOC, {
                            include: [
                                {
                                    association: Document.associations.revisions,
                                    order: [
                                        ['DT_SUB_REV', 'DESC']
                                    ]
                                },
                                {
                                    association: Document.associations.items,
                                    attributes: [
                                        "COD_ITEM"
                                    ]
                                }
                            ]
                        }).then(async document => {

                            // SE DOCUMENTO CADASTRADO ATUALIZA ==========================
                            if (document) {
                                let doc: any = document.toJSON();
                                let lastRevision = (document as any).revisions.length;

                                // CONTROLE DE REVISÕES ================================================
                                if (REV > 0) {

                                    // SE FOR UMA NOVA REVISÃO =========================================
                                    // REGISTRA REVISÃO ================================================

                                    if (lastRevision === 0 || REV > lastRevision) {
                                        for (let revCount = lastRevision; revCount < REV; revCount++) {
                                            await Revision.create({
                                                COD_DOC: document.COD_DOC,
                                                VALOR_ANTIGO: document.VALOR_DOC || 0,
                                                DIFERENCA_VALOR: VALUE - parseFloat((document.VALOR_DOC || 0).toString()),
                                                DT_RCB_REV: DT_REC,
                                                DT_SUB_REV: DT_SUB,
                                                DT_RG_REV: new Date(),
                                                NUM_REV: revCount + 1,
                                                CMT_REV: 'NSV: Revisão criada automaticamente',
                                                NUM_LINHAS_REVISADAS: document.QTD_LINHAS
                                            });
                                        }
                                    }

                                    // SE FOR UMA REVISÃO EXISTENTE ====================================
                                    // ATUALIZA AS INFORMAÇÕES DA ULTIMA REVISÃO =======================
                                    else if (lastRevision != 0 && lastRevision === REV) {

                                        let lastRev = ((document as any).revisions[lastRevision - 1] as Revision);

                                        await lastRev.update({
                                            DIFERENCA_VALOR: VALUE - parseFloat((lastRev.VALOR_ANTIGO || 0).toString()),
                                            DT_RCB_REV: DT_REC,
                                            DT_SUB_REV: DT_SUB
                                        });
                                    }
                                }

                                // ATUALIZA OS DETALHES DO DOCUMENTO ================================
                                await document.update({
                                    VALOR_DOC: VALUE,
                                    DT_RCB_DOC: DT_REC,
                                    DT_ENV_DOC: DT_SUB,
                                    COD_MOEDA: CURRENCY,
                                    COD_SIST: `EASY`,
                                    COD_AREA: responsible ? responsible.COD_AREA : null,
                                    COD_COOR: coordinator ? coordinator.COD_USU : null,
                                    COD_RESP: responsible ? responsible.COD_USU : null,
                                    COD_CLI: customer && customer.COD_CLI ? customer.COD_CLI : null,
                                    COD_FILI: customer && customer.COD_FILI ? customer.COD_FILI : null,
                                    QTD_LINHAS: doc.items.length
                                });
                            }

                            // SE NÃO CADASTRADO REGISTRA ================================
                            else if (responsible && responsible.COD_AREA) {

                                await Document.create({
                                    COD_DOC: COD_DOC,
                                    TIPO_DOC: "ZVCO",
                                    VALOR_DOC: VALUE,
                                    QTD_LINHAS: 0,
                                    DT_REGISTRO: new Date,
                                    DT_RCB_DOC: DT_REC,
                                    DT_ENV_DOC: DT_SUB,
                                    COD_STATUS_DOC: 6,
                                    COD_MOEDA: CURRENCY,
                                    COD_SIST: `EASY`,
                                    COD_AREA: responsible ? responsible.COD_AREA : null,
                                    COD_COOR: coordinator ? coordinator.COD_USU : null,
                                    COD_RESP: responsible ? responsible.COD_USU : null,
                                    COD_CLI: customer && customer.COD_CLI ? customer.COD_CLI : null,
                                    COD_FILI: customer && customer.COD_FILI ? customer.COD_FILI : null,
                                    CMT_DOC: "NSV - Oferta criada automaticamente"

                                    //COD_EQUI_SAP: ``,
                                    //DT_REMESSA: null,
                                    //COND_EXP: ``,// FALTA,
                                    //PED_REF: '', // FALTA

                                }).then(async document => {

                                    // REGISTRA AS REVISÕES ============================
                                    if (REV > 0) {
                                        for (let revCount = 0; revCount < REV; revCount++) {
                                            await Revision.create({
                                                COD_DOC: document.COD_DOC,
                                                VALOR_ANTIGO: document.VALOR_DOC || 0,
                                                DIFERENCA_VALOR: VALUE - parseFloat((document.VALOR_DOC || 0).toString()),
                                                DT_RCB_REV: DT_REC,
                                                DT_SUB_REV: DT_SUB,
                                                DT_RG_REV: new Date(),
                                                NUM_REV: revCount + 1,
                                                CMT_REV: 'NSV: Revisão criada automaticamente',
                                                NUM_LINHAS_REVISADAS: document.QTD_LINHAS
                                            });
                                        }
                                    }
                                });
                            }
                            else {
                                console.log(`Não importou ${COD_DOC} - resp: ${responsible}/ ${COD_RESP}`);
                            }
                        });
                    }
                });
            });
        }).catch(err => {
            console.log(err);
        });
    }

    public async importApprovalOrdersFromSap() {
        this.getLatestOrderHeaderSapFile().then(async filename => {
            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err) {
                    console.error("Could not open file: %s", err);
                    return;
                }

                var linhas = data.split('\n');
                for (var index = 0; index < linhas.length; index++) {
                    const SAPDocument = this.readDocumentFromJob(linhas[index])
                    if (SAPDocument) {
                        if (SAPDocument.documentSalesTeam === 'C57' || SAPDocument.documentSalesTeam === 'C77') {
                            if (SAPDocument.documentStatus === 4 && SAPDocument.documentConfirmationAt) {
                                let coordinator = await User.findOne({ where: { COD_SAP: SAPDocument.documentCoordinatorSAPCode } }).catch(() => { return null })

                                let responsible = await User.findOne({ where: { COD_SAP: SAPDocument.documentResponsibleSAPCode } }).catch(() => { return null })

                                let customer = await Customer.findByPk(SAPDocument.documentCustomer, {
                                    include: [
                                        {
                                            association: Customer.associations.coordinators,
                                            required: false,
                                            include: [
                                                {
                                                    association: CustomerCoordinator.associations.coordinator,
                                                    where: {
                                                        TIPO_COOR: [
                                                            "CORD",// coordenador de ordens
                                                            "COEO" // coordenador de ordem e ofertas
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }).catch(() => { return null });

                                if (!coordinator && (customer as any)?.coordinators[0]) { coordinator = (customer as any).coordinators[0].coordinator }

                                await Document.findOrCreate(
                                    {
                                        where: { COD_DOC: SAPDocument.documentSalesOrder },
                                        defaults: {
                                            COD_DOC: SAPDocument.documentSalesOrder,
                                            TIPO_DOC: SAPDocument.documentType,
                                            VALOR_DOC: SAPDocument.documentTotalValue,
                                            QTD_LINHAS: 0,
                                            COND_EXP: SAPDocument.documentShippingConditionCode,
                                            PED_REF: SAPDocument.documentRequestNumber,
                                            DT_REGISTRO: new Date,
                                            DT_RCB_DOC: SAPDocument.documentReceiptAt,
                                            DT_CONF: SAPDocument.documentConfirmationAt,
                                            DT_REMESSA: SAPDocument.documentShippingDate,
                                            COD_MOTI_NCA: SAPDocument.documentShippingConditionCode === "ZA" ? 2 : 16,
                                            COD_STATUS_DOC: SAPDocument.documentStatus,
                                            COD_CLI: customer?.COD_CLI || null,
                                            COD_FILI: customer?.COD_FILI || null,
                                            COD_EQUI_SAP: SAPDocument.documentSalesTeam,
                                            COD_MOEDA: SAPDocument.documentCurrency,
                                            COD_SIST: `${SAPDocument.documentRequestType || 'MAIL'}`,
                                            COD_AREA: responsible?.COD_AREA || null,
                                            COD_COOR: coordinator?.COD_USU || null,
                                            COD_RESP: responsible?.COD_USU || null,
                                            CMT_DOC: "NSV - Ordem importada automaticamente."
                                        }
                                    }
                                ).then(async document => {

                                    const projectSaleValue = await Item.findAll({
                                        attributes: [
                                            [Sequelize.fn('sum', Sequelize.col('VALOR')), 'value']
                                        ],
                                        include: [
                                            {
                                                association: Item.associations.offer,
                                                required: true,
                                                where: {
                                                    TIPO_DOC: "ZVCO",
                                                    COD_PROJ: {
                                                        [Op.not]: null
                                                    }
                                                }
                                            }
                                        ],
                                        where: {
                                            COD_DOC: SAPDocument.documentSalesOrder
                                        }
                                    }).then(value => {
                                        return JSON.parse(JSON.stringify(value))[0].value || 0;
                                    });

                                    const offerSaleValue = await Item.findAll({
                                        attributes: [
                                            [Sequelize.fn('sum', Sequelize.col('VALOR')), 'value']
                                        ],
                                        include: [
                                            {
                                                association: Item.associations.offer,
                                                required: true,
                                                where: {
                                                    TIPO_DOC: "ZVCO",
                                                    COD_PROJ: {
                                                        [Op.is]: undefined
                                                    }
                                                }
                                            }
                                        ],
                                        where: {
                                            COD_DOC: SAPDocument.documentSalesOrder
                                        }
                                    }).then(value => {
                                        return JSON.parse(JSON.stringify(value))[0].value || 0;
                                    });

                                    const countItens = await Item.count({
                                        where: {
                                            COD_DOC: SAPDocument.documentSalesOrder
                                        }
                                    }).then(itens => {
                                        return itens;
                                    });

                                    // SE NÃO FOR DOCUMENTO NOVO ATUALIZA
                                    if (!document[1]) {
                                        await document[0].update({
                                            VALOR_DOC: SAPDocument.documentTotalValue,
                                            VALOR_VENDIDO_DE_OFERTA: offerSaleValue,
                                            VALOR_VENDIDO_DE_PROJETO: projectSaleValue,
                                            QTD_LINHAS: countItens,
                                            COND_EXP: SAPDocument.documentShippingConditionCode,
                                            PED_REF: SAPDocument.documentRequestNumber,
                                            DT_RCB_DOC: SAPDocument.documentReceiptAt,
                                            DT_CONF: SAPDocument.documentConfirmationAt,
                                            DT_REMESSA: SAPDocument.documentShippingDate,
                                            COD_STATUS_DOC: SAPDocument.documentStatus,
                                            COD_CLI: customer?.COD_CLI || null,
                                            COD_FILI: customer?.COD_FILI || null,
                                            COD_MOEDA: SAPDocument.documentCurrency,
                                            COD_EQUI_SAP: SAPDocument.documentSalesTeam,
                                            COD_AREA: responsible?.COD_AREA || null,
                                            COD_COOR: coordinator?.COD_USU || null,
                                            COD_RESP: responsible?.COD_USU || null
                                        })
                                    }

                                    // SE FOR DOCUMENTO NOVO CRIAR PASTA
                                    else {
                                        this.createOrderFolder(document[0])
                                    }
                                }).catch(err => {
                                    console.log(err);
                                });
                            }
                        }
                    }
                }
            });
        });
    }

    public async importOfferFromSap() {
        this.getLatestOfferHeaderSapFile().then(async filename => {

            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err) { console.error("Could not open file: %s", err); process.exit(1); }

                var linhas = data.split('\n');

                for (var index = 0; index < linhas.length; index++) {

                    let row = linhas[index].replace(/ /g, '').split('|');
                    let fullRow = linhas[index].split('|');

                    if (util.matchDocument(row[1])) {

                        // DATA PARSE ===============================
                        const COD_DOC = row[1];
                        const TIPO_DOC = row[2];
                        const COD_EQUI_SAP = row[3];
                        const DT_REC = util.convertDate(row[4]);
                        const VALOR = util.converSapValue(row[8]);
                        const MOEDA = row[9];
                        const PED_REF = fullRow[10];
                        const COD_STATUS_DOC = util.convertOfferStatus(row[11]);
                        const COND_EXP = util.converdSapDeliverType(row[17]);

                        // SOMENTE OFERTAS EM ANALISE DO CLIENTE E COM A DATA DE RECEBIMENTO PREENCHIDAS
                        if (COD_STATUS_DOC === 6 && DT_REC) {

                            const responsible = await User.findOne({
                                include: {
                                    association: User.associations.workgroup
                                },
                                where: {
                                    COD_SAP: row[12]
                                }
                            }).then(result => {
                                return result;
                            });

                            const customer = await Customer.findOne({
                                include: [
                                    {
                                        association: Customer.associations.coordinators,
                                        required: false,
                                        include: [
                                            {
                                                association: CustomerCoordinator.associations.coordinator,
                                                where: {
                                                    TIPO_COOR: [
                                                        "COFE", // COORDENADOR DE OFERTAS
                                                        "COEO"  // COORDENADOR DE ORDEM E OFERTAS
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ],
                                where: {
                                    COD_CLI: row[5]
                                }
                            }).then(result => {
                                return result;
                            });

                            const coordinator = (customer as any).coordinators[0] ? (customer as any).coordinators[0].coordinator : null;

                            await Document.findByPk(COD_DOC).then(async document => {
                                if (!document) {
                                    await Document.create({
                                        COD_DOC: COD_DOC,
                                        TIPO_DOC: TIPO_DOC,
                                        VALOR_DOC: VALOR,
                                        QTD_LINHAS: 0,
                                        COND_EXP: COND_EXP,
                                        PED_REF: PED_REF,
                                        DT_REGISTRO: new Date,
                                        DT_RCB_DOC: DT_REC,
                                        COD_STATUS_DOC: COD_STATUS_DOC,
                                        COD_CLI: customer && customer.COD_CLI ? customer.COD_CLI : null,
                                        COD_FILI: customer && customer.COD_FILI ? customer.COD_FILI : null,
                                        COD_EQUI_SAP: COD_EQUI_SAP,
                                        COD_MOEDA: MOEDA,
                                        COD_AREA: responsible ? responsible.COD_AREA : null,
                                        COD_COOR: coordinator ? coordinator.COD_USU : null,
                                        COD_RESP: responsible ? responsible.COD_USU : null,
                                        CMT_DOC: "NSV - Oferta importada automaticamente."
                                    }).then(offer => {
                                        if (process.env.NODE_ENV === 'development')
                                            console.log("Oferta criada", offer.COD_DOC, offer.VALOR_DOC);
                                    });
                                }

                                else {
                                    const countItens = await Item.count({
                                        where: {
                                            COD_DOC: COD_DOC
                                        }
                                    }).then(itens => {
                                        return itens;
                                    });

                                    await document.update({
                                        VALOR_DOC: VALOR,
                                        QTD_LINHAS: countItens,
                                        COND_EXP: COND_EXP,
                                        PED_REF: PED_REF,
                                        DT_RCB_DOC: DT_REC,
                                        COD_STATUS_DOC: COD_STATUS_DOC,
                                        COD_CLI: customer && customer.COD_CLI ? customer.COD_CLI : null,
                                        COD_FILI: customer && customer.COD_FILI ? customer.COD_FILI : null,
                                        COD_EQUI_SAP: COD_EQUI_SAP,
                                        COD_MOEDA: MOEDA,
                                        COD_AREA: responsible ? responsible.COD_AREA : null,
                                        COD_COOR: coordinator ? coordinator.COD_USU : null,
                                        COD_RESP: responsible ? responsible.COD_USU : null
                                    }).then(offer => {
                                        if (process.env.NODE_ENV === 'development')
                                            console.log("Oferta atualizada", offer.COD_DOC, offer.COD_COOR);
                                    });
                                }
                            });
                        }
                    }
                }
            });
        });
    }

    public async importConfirmedOrdersFromSap() {
        this.getLatestOrderHeaderSapFile().then(async filename => {
            await fs.readFile(filename, 'utf-8', async (err: any, data: any) => {

                if (err) {
                    console.error("Could not open file: %s", err);
                    return;
                }

                var linhas = data.split('\n');
                for (var index = 0; index < linhas.length; index++) {
                    const SAPDocument = this.readDocumentFromJob(linhas[index])
                    if (SAPDocument) {

                        // TIMES DE ORDENS ==============================
                        if (SAPDocument.documentSalesTeam === 'B85' || SAPDocument.documentSalesTeam === 'B84' || SAPDocument.documentSalesTeam === 'D44' || SAPDocument.documentSalesTeam == 'D46') {
                            if (SAPDocument.documentStatus === 4 && SAPDocument.documentConfirmationAt) {

                                let coordinator = await User.findOne({ where: { COD_SAP: SAPDocument.documentCoordinatorSAPCode } }).catch(() => { return null })

                                let responsible = await User.findOne({ where: { COD_SAP: SAPDocument.documentResponsibleSAPCode } }).catch(() => { return null })

                                let customer = await Customer.findByPk(SAPDocument.documentCustomer, {
                                    include: [
                                        {
                                            association: Customer.associations.coordinators,
                                            required: false,
                                            include: [
                                                {
                                                    association: CustomerCoordinator.associations.coordinator,
                                                    where: {
                                                        TIPO_COOR: [
                                                            "CORD",// coordenador de ordens
                                                            "COEO" // coordenador de ordem e ofertas
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }).catch(() => { return null });

                                if (!coordinator && (customer as any)?.coordinators[0]) { coordinator = (customer as any).coordinators[0].coordinator }

                                await Document.findOrCreate(
                                    {
                                        where: { COD_DOC: SAPDocument.documentSalesOrder },
                                        defaults: {
                                            COD_DOC: SAPDocument.documentSalesOrder,
                                            TIPO_DOC: SAPDocument.documentType,
                                            VALOR_DOC: SAPDocument.documentTotalValue,
                                            QTD_LINHAS: 0,
                                            COND_EXP: SAPDocument.documentShippingConditionCode,
                                            PED_REF: SAPDocument.documentRequestNumber,
                                            DT_REGISTRO: new Date,
                                            DT_RCB_DOC: SAPDocument.documentReceiptAt,
                                            DT_CONF: SAPDocument.documentConfirmationAt,
                                            DT_REMESSA: SAPDocument.documentShippingDate,
                                            COD_MOTI_NCA: SAPDocument.documentShippingConditionCode === "ZA" ? 2 : 16,
                                            COD_STATUS_DOC: SAPDocument.documentStatus,
                                            COD_CLI: customer?.COD_CLI || null,
                                            COD_FILI: customer?.COD_FILI || null,
                                            COD_EQUI_SAP: SAPDocument.documentSalesTeam,
                                            COD_MOEDA: SAPDocument.documentCurrency,
                                            COD_SIST: `${SAPDocument.documentRequestType || 'MAIL'}`,
                                            COD_AREA: responsible?.COD_AREA || null,
                                            COD_COOR: coordinator?.COD_USU || null,
                                            COD_RESP: responsible?.COD_USU || null,
                                            CMT_DOC: "NSV - Ordem importada automaticamente."
                                        }
                                    }
                                ).then(async document => {

                                    const projectSaleValue = await Item.findAll({
                                        attributes: [
                                            [Sequelize.fn('sum', Sequelize.col('VALOR')), 'value']
                                        ],
                                        include: [
                                            {
                                                association: Item.associations.offer,
                                                required: true,
                                                where: {
                                                    TIPO_DOC: "ZVCO",
                                                    COD_PROJ: {
                                                        [Op.not]: null
                                                    }
                                                }
                                            }
                                        ],
                                        where: {
                                            COD_DOC: SAPDocument.documentSalesOrder
                                        }
                                    }).then(value => {
                                        return JSON.parse(JSON.stringify(value))[0].value || 0;
                                    });

                                    const offerSaleValue = await Item.findAll({
                                        attributes: [
                                            [Sequelize.fn('sum', Sequelize.col('VALOR')), 'value']
                                        ],
                                        include: [
                                            {
                                                association: Item.associations.offer,
                                                required: true,
                                                where: {
                                                    TIPO_DOC: "ZVCO",
                                                    COD_PROJ: {
                                                        [Op.is]: undefined
                                                    }
                                                }
                                            }
                                        ],
                                        where: {
                                            COD_DOC: SAPDocument.documentSalesOrder
                                        }
                                    }).then(value => {
                                        return JSON.parse(JSON.stringify(value))[0].value || 0;
                                    });

                                    const countItens = await Item.count({
                                        where: {
                                            COD_DOC: SAPDocument.documentSalesOrder
                                        }
                                    }).then(itens => {
                                        return itens;
                                    });

                                    // SE NÃO FOR DOCUMENTO NOVO ATUALIZA
                                    if (!document[1]) {
                                        await document[0].update({
                                            VALOR_DOC: SAPDocument.documentTotalValue,
                                            VALOR_VENDIDO_DE_OFERTA: offerSaleValue,
                                            VALOR_VENDIDO_DE_PROJETO: projectSaleValue,
                                            QTD_LINHAS: countItens,
                                            COND_EXP: SAPDocument.documentShippingConditionCode,
                                            PED_REF: SAPDocument.documentRequestNumber,
                                            DT_RCB_DOC: SAPDocument.documentReceiptAt,
                                            DT_CONF: SAPDocument.documentConfirmationAt,
                                            DT_REMESSA: SAPDocument.documentShippingDate,
                                            COD_STATUS_DOC: SAPDocument.documentStatus,
                                            COD_CLI: customer?.COD_CLI || null,
                                            COD_FILI: customer?.COD_FILI || null,
                                            COD_MOEDA: SAPDocument.documentCurrency,
                                            COD_EQUI_SAP: SAPDocument.documentSalesTeam,
                                            COD_AREA: responsible?.COD_AREA || null,
                                            COD_COOR: coordinator?.COD_USU || null,
                                            COD_RESP: responsible?.COD_USU || null
                                        })
                                    }

                                    // SE FOR DOCUMENTO NOVO CRIAR PASTA
                                    else {
                                        this.createOrderFolder(document[0])
                                    }
                                }).catch(err => {
                                    console.log(err);
                                });
                            }
                        }
                    }
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    // JOB FINDERS =======================================================
    /*
    THE FUNCTIONS BELLOW ARE NECESARY TO GET IMPORTS FROM OTHER SYSTEMS ==
    LIKE EASY AND SAP (TO CHANGE THE 'LOCATION_JOBFILE' SET IN .env FILE) 
    */

    private async getLatestOrderHeaderSapFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/ORDEM/Cab`;

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

    private async getLatestClaimHeaderSapFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/CLAIM/Cab`;

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

    private async getLatestOfferHeaderEasyFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/OFERTA/Cab_EASY`;

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

    private async getLatestOfferHeaderSapFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            var str = '';

            const location = `${process.env.LOCATION_JOBFILE}/OFERTA/Cab`;

            fs.readdir(location, (err: any, files: Array<string>) => {
                let lastFileName: string = '';
                let lastModifiedArchive = 0;

                if (err)
                    reject(err);

                for (const file of files) {
                    var statsObj = fs.statSync(`${location}/${file}`);

                    if (statsObj.birthtime > lastModifiedArchive) {
                        lastModifiedArchive = statsObj.birthtime;
                        lastFileName = file;
                    }
                }

                resolve(`${location}/${lastFileName}`);
            });
        });
    }

    private readDocumentFromJob(data: string): ISAPDocument | null {
        let row = data.replace(/ /g, '').split('|');

        if (!util.matchDocument(row[1])) {
            return null
        }

        return {
            documentSalesOrder: row[1], // ======================== Ordemdevenda: 132888717
            documentType: row[2], // ============================== Tipodedocumentodevendas: ZVEX
            documentSalesTeam: row[3], // ========================= Equipedevendas: B84
            documentReceiptAt: util.convertDate(row[4]), // ======= Datadopedido: 01.11.2021
            documentConfirmationAt: util.convertDate(row[5]), // == DtImplantaçãoOV: 01.11.2021
            documentCustomer: parseInt(row[6]), // ================ Emissordaordem: 51594
            documentCustomerName: row[7], // ====================== Nomedoemissordaordem: DALELEKTRIKMOTORLARI & GCAKT.
            documentRequestNumber: row[8], // ===================== Nr.Pedido: DALGAKIRAN4100029064
            documentRequestType: row[10],  // ===================== TipodePedido: EASY
            documentStatus: util.converSapOrderStatus(row[11]),// = Statusdousuário: Conf
            documentShippingDate: util.convertDate(row[12]), // === DatadeRemessa: 25.03.2022
            documentShippingConditionDescription: row[13],  // ==== Denominaçãodacondiçãodeexpedição: MarítimoExportação
            documentShippingBlock: row[14], // ==================== Bloqueioderemessa:
            documentTotalValue: util.converSapValue(row[15]),  // = Vlrtotalordem: 153, 22
            documentCurrency: row[16],  // ======================== Moeda: EUR
            documentResponsibleSAPCode: parseInt(row[18]),  // ==== Coordenadordevendas: 73117
            documentCoordinatorSAPCode: parseInt(row[17]),  // ==== Funcion�rioRespons�vel: 6475
            documentCreatedAt: util.convertDate(row[20]),  // ===== Criadoem(data): 01.11.2021
            documentShippingConditionCode: row[21]  // ============ Condi��odeexpedi��o: Z0
        }
    }

}

export default new DocumentController()