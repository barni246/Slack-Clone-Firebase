export class User {
    id: number; 
    name: string;
    email: string;
    password: string;
    loggedIn: boolean;
    profile: any;

    constructor(obj?: any) {
        this.id = obj ? obj.id : ''; 
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.loggedIn = obj ? obj.loggedIn : false; 
        this.profile = obj ? obj.profile : '';
    }

    public toJSON() {
        return {
            id: this.id, 
            name: this.name,
            email: this.email,
            password: this.password,
            loggedIn: this.loggedIn,
            profile: this.profile
        };
    }
}