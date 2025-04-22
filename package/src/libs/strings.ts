export const padLeft = (str: string, length: number, char: string = " ") => {
  while (str.length < length) str = char+str;
  return str;
}
export const padRight = (str: string, length: number, char: string = " ") => {
  while (str.length < length) str = str+char;
  return str;
}