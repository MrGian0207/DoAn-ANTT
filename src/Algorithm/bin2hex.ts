export default function bin2hex(s: string): string {
    let mp: any = {
      "0000": "0",
      "0001": "1",
      "0010": "2",
      "0011": "3",
      "0100": "4",
      "0101": "5",
      "0110": "6",
      "0111": "7",
      1000: "8",
      1001: "9",
      1010: "A",
      1011: "B",
      1100: "C",
      1101: "D",
      1110: "E",
      1111: "F",
    };
    let hex = "";
    for (let i = 0; i < s.length; i += 4) {
      let ch = "";
      ch += s[i];
      ch += s[i + 1];
      ch += s[i + 2];
      ch += s[i + 3];
      hex += mp[ch];
    }
    return hex;
  }