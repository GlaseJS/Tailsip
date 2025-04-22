export const padLeft = (str, length, char = " ") => {
    while (str.length < length)
        str = char + str;
    return str;
};
export const padRight = (str, length, char = " ") => {
    while (str.length < length)
        str = str + char;
    return str;
};
