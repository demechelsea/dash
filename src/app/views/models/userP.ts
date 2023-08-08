export interface UserP {
    password: string,
    isActive: boolean,
    username : string,
    employee: {
        id: number,
    },
    roles: [],
    role: string;
    
}