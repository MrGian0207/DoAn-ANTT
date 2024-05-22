export default function permute(k: string, arr: number[], n: number): string {
  let permutation = "";
  for (let i = 0; i < n; i++) {
    permutation += k[arr[i] - 1];
  }
  return permutation;
}
