import {AbstractControl, ValidatorFn} from "@angular/forms";

export function upperCaseFirstLetter(str: string) {
    if (!str || str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function upperCaseAllFirstLetters(str: string) {
    if (!str || str.length === 0) {
        return str;
    }
    let words = str.split(/\s+/);
    let result = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return result.join(' ');
}


export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (typeof control.value === 'string') {
            if (control.value.trim() === '') {
                return {'whitespace': true};
            }
        } else if (typeof control.value === 'object' && control.value !== null) {
            if (control.value.label && control.value.label.trim() === '') {
                return {'whitespace': true};
            }
        }
        return null;
    };
}
