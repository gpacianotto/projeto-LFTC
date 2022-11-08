export const isLetterLowerCase = (letter) => {
    return letter.toLowerCase() === letter;
}

export const isLetterUpperCase = (letter) => {
    return letter.toUpperCase() === letter;
}

export const getUpperCaseLetter = (str) => str.replace(/[a-z]/g, '');

export const getLowerCaseLetter = (str) => str.replace(/[A-Z]/g, '');