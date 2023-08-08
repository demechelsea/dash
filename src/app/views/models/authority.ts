export interface Authority {
    id: number;
    employee: {
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
        parent: number;
    }
    }
    stampImage: BinaryData;
    signatureImage: BinaryData;
    isActive: boolean
}