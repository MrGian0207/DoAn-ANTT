export default function xor(a: string, b: string): string {
  let ans = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] == b[i]) {
      ans += "0";
    } else {
      ans += "1";
    }
  }
  return ans;
}
