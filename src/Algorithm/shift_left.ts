export default function shift_left(k: string, nth_shifts: number): string {
  let s = "";
  for (let i = 0; i < nth_shifts; i++) {
    for (let j = 1; j < k.length; j++) {
      s += k[j];
    }
    s += k[0];
    k = s;
    s = "";
  }
  return k;
}
