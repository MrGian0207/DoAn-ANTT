export default function bin2dec(binary: string): number {
  let decimal = 0;
  let Binary: number = parseInt(binary);
  let i = 0;
  while (Binary !== 0) {
    let dec = Binary % 10;
    decimal += dec * Math.pow(2, i);
    Binary = Math.floor(Binary / 10);
    i++;
  }
  return decimal;
}
