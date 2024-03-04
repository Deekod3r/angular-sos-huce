export interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

export interface petSearchKey {
    limit: number,
    page: number,
    code: string,
    name: string,
    status: number | null,
    type: number | null,
    gender: number | null,
    age: number | null,
    color: string,
    breed: string,
    diet: number | null,
    vaccine: number | null,
    sterilization: number | null,
    rabies: number | null,
    adoptedBy: string
}