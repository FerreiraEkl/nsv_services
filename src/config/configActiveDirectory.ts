const activeDirectory = require('activedirectory');

interface IADUser {
    name: string,
    branch: string,
    department: string,
    section: string,
    mail: string,
    phone: string,
    picture: any
}

class ActiveDirectory {

    private customeParser(
        entry: { thumbnailPhoto: any; },
        raw: { hasOwnProperty: (arg0: string) => any; thumbnailPhoto: any; },
        callback: (arg0: any) => void) {
        if (raw.hasOwnProperty("thumbnailPhoto")) {
            entry.thumbnailPhoto = raw.thumbnailPhoto;
        }
        callback(entry)
    }

    public async getUserData(userLogin: string): Promise<IADUser> {
        const ActiveDirectoryData = new activeDirectory({
            url: process.env.ACTIVE_DIRECTORY_SEARCH_URL,
            baseDN: 'DC=weg,DC=net', // LIMITAÇÕES DE PESQUISA
            username: process.env.ACTIVE_DIRECTORY_SEARCH_LOGIN,
            password: process.env.ACTIVE_DIRECTORY_SEARCH_PASS, // SENHA
            attributes: { // ATRIBUTOS DA PESQUISA
                user: [
                    'name',
                    'company',
                    'department',
                    'physicalDeliveryOfficeName',
                    'mail',
                    'telephoneNumber',
                    'thumbnailPhoto'
                ]
            },
            entryParser: this.customeParser
        });

        return new Promise((resolve, reject) => {
            ActiveDirectoryData.findUser(userLogin, (err: any, ldapUser: any) => {
                if (err)
                    return reject(err);

                if (!ldapUser)
                    return reject("Not Found");

                resolve({
                    name: ldapUser.name,
                    branch: ldapUser.company,
                    department: ldapUser.department,
                    section: ldapUser.physicalDeliveryOfficeName,
                    mail: ldapUser.mail,
                    phone: ldapUser.telephoneNumber,
                    picture: ldapUser.thumbnailPhoto
                });
            });
        });
    }

    public async authenticate(login: string, password: string): Promise<IADUser> {

        const endLogin = (login.indexOf('@weg.net') != -1 ? login : `${login}@weg.net`);
        const ActiveDirectoryAuth = new activeDirectory({ url: process.env.ACTIVE_DIRECTORY_URL });

        return new Promise((resolve, reject) => {

            ActiveDirectoryAuth.authenticate(endLogin, password, (err: any, auth: any) => {
                if (err)
                    return reject(err);

                if (!auth)
                    return reject("Unauthorized");

                this.getUserData(login).then(ldapUser => {
                    resolve(ldapUser);
                }).catch(err => {
                    return reject(err);
                })
            });
        });
    }
}

export default new ActiveDirectory()