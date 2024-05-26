export default function dec2bin(num: number): string {
  let res = (num >>> 0).toString(2);
  if (res.length % 4 !== 0) {
    let div = Math.floor(res.length / 4);
    let counter = 4 * (div + 1) - res.length;
    for (let i = 0; i < counter; i++) {
      res = "0" + res;
    }
  }
  return res;
}
