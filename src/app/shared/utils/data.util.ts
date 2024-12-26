import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function convertDateFormat(inputDate: any): string {
    if (typeof inputDate === 'string') {
        const parts = inputDate.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${year}-${month}-${day}`;
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

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        return {'passwordMismatch': true};
    }
    return null;
};

export function filteredSearch(search: any): any {
    return Object.fromEntries(
        Object.entries(search).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
}
