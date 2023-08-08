export interface Employee {
    id: number;
    givenName: string;
    fatherName: string;
    grandFatherName: string;
    position : string;
    email: string;
    phoneNumber: string;
    division: {
        id: number,
        name: string,
        parent: number
    }
}