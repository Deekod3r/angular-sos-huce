export function convertDateFormat(inputDate: any): string {
    if (typeof inputDate === 'string') {
        const parts = inputDate.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    } else {
        return inputDate.toISOString().split('T')[0]
    }
}

export function convertDateTimeFormat(inputDate: any, type: boolean): any {
    const parts = inputDate.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    let formattedDate = `${year}-${month}-${day}`;
    if (type) {
        formattedDate += `T00:00:00`;
    } else {
        formattedDate += `T23:59:59`;
    }
    return formattedDate;
}