export function upcaseFirstLetter(str: string) {
    if (!str || str.length === 0) {
        return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function upcaseAllFirstLetters(str: string) {
    if (!str || str.length === 0) {
        return str;
    }

    let words = str.split(/\s+/);
    let result = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    return result.join(' ');
}