import cron from 'cron';

class Cron {

    private CronJob = cron.CronJob;

    constructor() { }

    public montlyExecution(routine: any, dayOfMonth?: number) {
        const job = new this.CronJob(`0 0 0 ${(dayOfMonth ? (dayOfMonth < 1 ? 1 : (dayOfMonth > 31 ? 31 : dayOfMonth)) : 1)} * *`, function () {
            routine();
        }, null, true, 'America/Sao_Paulo');
    }

    public weekExecution(routine: any, dayOfWeek?: number) {
        const job = new this.CronJob(`* * * * * ${(dayOfWeek ? (dayOfWeek < 1 ? 1 : (dayOfWeek > 7 ? 7 : dayOfWeek)) : 6)}`, function () {
            routine();
        }, null, true, 'America/Sao_Paulo');
    }

    public daylyExecution(routine: any) {
        const job = new this.CronJob('0 0 0 * * *', function () {
            routine();
        }, null, true, 'America/Sao_Paulo');
    }

    public tenMinutes(routine: any) {
        const job = new this.CronJob('*/10 * * * *', function () {
            routine();
        }, null, true, 'America/Sao_Paulo');
    }


    public hourExecution(routine: any) {
        const job = new this.CronJob('0 0 * * * *', function () {
            routine();
        }, null, true, 'America/Sao_Paulo');
    }

    public testExecution(routine: any) {
        const job = new this.CronJob('0 * * * * *', function () {
            routine();
        }, null, true, 'America/Sao_Paulo');
    }
}

export default new Cron();