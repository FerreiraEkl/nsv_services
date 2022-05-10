import Express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import Database from './schemas/databaseSchema';
import RoutinesService from './services/routinesService';
import routes from './routes/routes';

class App {

    public express: Express.Application;

    constructor() {
        this.express = Express();
        this.middlewares();
        this.database();
        this.routes();
        this.exceptionHandler();
        if (process.env.NODE_ENV === 'development')
            RoutinesService.test();
        else
            RoutinesService.start();
    }

    private middlewares(): void {
        this.express.use(cors({
            "origin": [process.env.MAIN_URL || ""],
            "methods": ["GET", "PUT", "POST", "DELETE"]

        }));

        this.express.use(Express.json());
    }

    private database(): void {
        Database.relationShipStart();
    }

    private routes(): void {
        // CHAMADAS DE API
        this.express.use("/api", routes);

        // ARQUIVOS STATICOS
        this.express.use(Express.static(__dirname + '/public'));

        // CHAMADAS DO ANGULAR
        this.express.get("/*", (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
    }

    private exceptionHandler() {
        this.express.use(async (err: Error, req: Request, res: Response, next: any) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(err);
                return res.status(500).json(JSON.parse(JSON.stringify(err)));
            }
            return res.status(500).json({ error: 'Internal server error' });
        });
    }
}

export default new App().express;