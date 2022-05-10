import http from 'http';

class SoapService {

    // FEATURE TRANSLATIONS =============================================
    public async getFeatureTranslation(feature: string, lang: ('pt' | 'en' | 'es' | string)): Promise<string> {

        const data = JSON.stringify(["ZACOPLAMENTO_01", feature]);

        const options = {
            host: '10.0.36.129',
            port: 35029,
            path: `/vctranslations?lang=${lang}`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WEB Order Form',
                'Content-Length': data.length
            },
            "rejectUnauthorized": false
        };

        return new Promise((resolve, reject) => {
            var str = '';

            const request = http.request(options, (response: any) => {

                response.on('data', (chunk: any) => { str += chunk; });

                response.on('end', async () => {
                    try {

                        let resp = JSON.parse(str);
                        Object.keys(resp).forEach((field: any) => {
                            if (field === feature) {
                                const translate = resp[field];
                                resolve(translate);
                            }
                        });
                    } catch (err) {
                        return reject(err);
                    }
                });

                response.on('error', (err: any) => { return reject(err); });
            });
            request.write(data);
            request.end();
        });
    }

    public async getFeatureValueTranslation(feature: string, value: string, lang: ('pt' | 'en' | 'es')): Promise<string> {

        const options = {
            host: 'dcprd036219.weg.net',
            path: `/api/Characteristic/GetValuesByName?characteristicName=${feature}&language=${lang}`,
            method: "GET",
            headers: { 'User-Agent': 'om.c' },
            "rejectUnauthorized": false
        };

        return new Promise((resolve, reject) => {
            var str = '';

            http.request(options, (response: any) => {

                response.on('data', (chunk: any) => { str += chunk; });

                response.on('end', async () => {
                    try {

                        let resp = <Array<{ Key: string; Value: string; }>>JSON.parse(str);
                        const foundValue = resp.find((feature) => feature.Key === value);
                        if (foundValue)
                            resolve(foundValue.Value);
                        else
                            return reject("Not found");

                    } catch (err) {
                        return reject(err);
                    }
                });

                response.on('error', (err: any) => { return reject(err); });
            }).end();
        });
    }

    public async getFeatureAllValuesTranslation(feature: string, lang: string): Promise<Array<{ Key: string; Value: string; }>> {

        const options = {
            host: 'dcprd036219.weg.net',
            path: `/api/Characteristic/GetValuesByName?characteristicName=${feature}&language=${lang}`,
            method: "GET",
            headers: { 'User-Agent': 'om.c' },
            "rejectUnauthorized": false
        };

        return new Promise((resolve, reject) => {
            var str = '';

            http.request(options, (response: any) => {

                response.on('data', (chunk: any) => { str += chunk; });

                response.on('end', async () => {
                    try {
                        let resp = <Array<{ Key: string; Value: string; }>>JSON.parse(str);
                        resolve(resp);
                    } catch (err) {
                        return reject(err);
                    }
                });

                response.on('error', (err: any) => { return reject(err); });
            }).end();
        });
    }

    // ORDER INFO ======================================================
    public async getOrderItems(orderId: number): Promise<Array<{
        itemSalesOrder: number,
        itemPosition: number,
        itemQuantity: number,
        itemDescription: string,
        itemMaterial: number
    }>> {
        var options = {
            host: '10.0.36.129',
            port: '35029',
            path: `/salesorder?salesordernumber=${orderId}&item=`,
            headers: { 'User-Agent': 'om.c' },
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            var str = '';

            http.request(options, (response: any) => {

                response.on('data', (chunk: any) => { str += chunk; });

                response.on('end', async () => {
                    try {
                        let resp = <Array<{
                            "ConfirmedQuantity": string,
                            "Description": string,
                            "Incoterm1": string,
                            "Incoterm2": string,
                            "Item": string,
                            "LoadingDate": string,
                            "Material": string,
                            "NetPrice": string,
                            "NetValue": string,
                            "OrderQuantity": string,
                            "SalesOrder": string,
                            "SalesUnit": string,
                            "ScheduleLineDate": string,
                            "ShippedQuantity": string
                        }>>JSON.parse(str);

                        let result = [];

                        for (const item of resp) {
                            let newItem: any = {};
                            newItem['itemSalesOrder'] = parseInt(item.SalesOrder);
                            newItem['itemPosition'] = parseInt(item.Item);
                            newItem['itemQuantity'] = parseInt(item.OrderQuantity);
                            newItem['itemDescription'] = item.Description;
                            newItem['itemMaterial'] = parseInt(item.Material);

                            let isIncluded = result.find(oldItem => oldItem.itemPosition === newItem.itemPosition)
                            if (!isIncluded)
                                result.push(newItem);
                        }

                        resolve(result);
                    }

                    catch (err) {
                        return reject(err);
                    }
                });

                response.on('error', (err: any) => { return reject(err); });
            }).end();
        });
    }

    // ITEM INFO =======================================================
    public async getItem(itemNumber: string | number): Promise<any> {

        const data = JSON.stringify({
            "Language": "PT",
            "Material": {
                "Number": itemNumber
            },
            "Configuration": ""
        });

        const options = {
            host: '10.0.36.129',
            port: '35010',
            method: 'POST',
            path: '/get_variant_configuration',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WEB Order Form',
                'Content-Length': data.length
            },
            "rejectUnauthorized": false
        };

        return new Promise((resolve, reject) => {
            var str = '';

            const request = http.request(options, (response: any) => {

                response.on('data', (chunk: any) => { str += chunk; });

                response.on('end', async () => {
                    try {

                        let object = JSON.parse(str);
                        let newItem: any = {};

                        for (const field of object.VariantDocumentList.VariantDocument.CharacteristicList.Characteristic) {
                            newItem[(field.Code)] = field.ValueList.Value.Value
                        }

                        newItem = <any>JSON.parse(JSON.stringify(newItem))

                        resolve(newItem);
                    } catch (err) {
                        return reject(err);
                    }
                });

                response.on('error', (err: any) => { return reject(err); });
            });
            request.write(data);
            request.end();
        });
    }
}

export default new SoapService();