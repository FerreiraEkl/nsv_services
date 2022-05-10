import { isDate } from "util";

class util {

    public matchDocument(stringToSearch: string): boolean {

        if (!stringToSearch)
            return false;

        if (stringToSearch.length > 11)
            return false;

        if (stringToSearch.length < 4)
            return false;

        if (!stringToSearch.match('[1-9]\d*'))
            return false;

        return true;
    }

    public convertDate(date: string): Date | null {
        let year = date.split('.')[2];
        let month = parseInt(date.split('.')[1]);
        let day = date.split('.')[0];

        if (date.split('.').length == 3) {
            var fdate = new Date(`${year}-${month}-${day}`);
            fdate.setUTCHours(3)
            return isDate(fdate) ? fdate : null;
        }

        else
            return null;
    }

    public converSapValue(value: string): number {
        let parts = value.split(',');
        let integer = parts[0].replace('.', '').replace('.', '').replace('.', '').replace('.', '').replace('.', '');
        //console.log(`${integer}.${parts[1]}`);
        return parseFloat(`${integer}.${parts[1]}`);
    }

    public converSapOrderStatus(value: string): number {
        switch (value) {
            case 'Conf':
                return 4;
            case 'Aprv':
                return 3;
            case 'Elab':
                return 2;
            default:
                return 2;
        }
    }

    public converdSapDeliverType(value: string): string {
        switch (value) {
            case 'ZA':
                return 'A'
            case 'Z0':
                return 'RO'
            case 'Z9':
                return 'M'
            case 'Z8':
                return 'C'
            default:
                return 'M';
        }
    }

    public convertCurrency(value: number, currency: string): string {
        const formatado = value.toLocaleString('pt-BR', { style: 'currency', currency: currency || 'USD' });
        return formatado;
    }

    public convertOfferStatus(statusSap: string): number {
        switch (statusSap) {
            case 'AnCl':
                return 6;

            case 'Elab':
                return 5;
            default:
                return 5;
        }
    }
}

export default new util()