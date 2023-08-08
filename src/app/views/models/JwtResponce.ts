export interface JwtResponce {
    user: {
    id: number;
    email: string;
    password: string;
    active: boolean;
    username : string;
    employee: {
        id: number,
        givenName: string,
        fatherName: string,
        grandFatherName: string,
        position : string,
        email: string,
        phoneNumber: string,
        division: {
            id: number,
            name: string,
            parent: number
        }
    }
    roles: [
        {
            id: number,
            name: string
        }          
    ],
    role: string;}

    jwtToken: string;
    
}