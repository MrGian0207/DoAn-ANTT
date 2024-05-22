import hex2bin from "./hex2bin";
import bin2dec from "./bin2dec";
import bin2hex from "./bin2hex";
import dec2bin from "./dec2bin";
import permute from "./permute";
import shift_left from "./shift_left";
import xor from "./xor";
import { initial_perm, exp_d, per, sbox, final_perm } from "./fips46-3";

export function encrypt(pt: string, rkb: string[], rk: string[]) {
  pt = hex2bin(pt);

  // Initial Permutation
  pt = permute(pt, initial_perm, 64);

  // Splitting
  let left = pt.slice(0, 32);
  let right = pt.slice(32, 64);
  for (let i = 0; i < 16; i++) {
    // Expansion D-box: Expanding the 32 bits data into 48 bits
    let right_expanded = permute(right, exp_d, 48);

    // XOR RoundKey[i] and right_expanded
    let xor_x = xor(right_expanded, rkb[i]);

    // S-boxex: substituting the value from s-box table by calculating row and column
    let sbox_str = "";
    for (let j = 0; j < 8; j++) {
      let row = bin2dec(
        xor_x.slice(j * 6, j * 6 + 1) + xor_x.slice(j * 6 + 5, j * 6 + 6)
      );
      let col = bin2dec(
        xor_x.slice(j * 6 + 1, j * 6 + 2) +
          xor_x.slice(j * 6 + 2, j * 6 + 3) +
          xor_x.slice(j * 6 + 3, j * 6 + 4) +
          xor_x.slice(j * 6 + 4, j * 6 + 5)
      );
      let val = sbox[j][row][col];
      sbox_str += dec2bin(val);
    }

    // Straight D-box: After substituting rearranging the bits
    sbox_str = permute(sbox_str, per, 32);

    // XOR left and sbox_str
    let result = xor(left, sbox_str);
    left = result;

    // Swapper
    if (i !== 15) {
      [left, right] = [right, left];
    }
    console.log(`Round ${i + 1} ${bin2hex(left)} ${bin2hex(right)} ${rk[i]}`);
  }

  // Combination
  let combine = left + right;

  // Final permutation: final rearranging of bits to get cipher text
  let cipher_text = permute(combine, final_perm, 64);
  return cipher_text;
}

export function base64ToHex(base64String: string): string {
  // Chuyển đổi Base64 sang chuỗi binary
  let binaryString = atob(base64String);

  // Khởi tạo một chuỗi hex rỗng
  let hexString = "";

  // Duyệt qua từng byte của chuỗi binary và chuyển đổi thành hex
  for (let i = 0; i < binaryString.length; i++) {
    let hexChar = binaryString.charCodeAt(i).toString(16);

    // Đảm bảo rằng mỗi byte được biểu diễn bởi hai ký tự hex
    if (hexChar.length === 1) {
      hexChar = "0" + hexChar;
    }

    // Ghép kết quả vào chuỗi hex
    hexString += hexChar;
  }

  return hexString;
}

export function hexToBase64(hexString: string): string {
  // Khởi tạo một chuỗi binary rỗng
  let binaryString = "";

  // Duyệt qua từng cặp ký tự hex (mỗi byte) và chuyển đổi thành binary
  for (let i = 0; i < hexString.length; i += 2) {
    let byte = parseInt(hexString.substr(i, 2), 16);
    binaryString += String.fromCharCode(byte);
  }

  // Chuyển đổi binary sang Base64
  let base64String = btoa(binaryString);

  return base64String;
}

export function base64ToBlob(base64String: string, typeFile: string): Blob {
  // Chuyển đổi Base64 thành binary data
  let binaryString = atob(base64String);

  // Khởi tạo một mảng chứa các byte của binary data
  let bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Tạo một Blob từ binary data
  let mimeType: string;
  switch (typeFile) {
    case "pdf":
      mimeType = "application/pdf";
      break;
    case "docx":
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    case "pptx":
      mimeType =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      break;
    case "xlsx":
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    case "jpg":
    case "jpeg":
      mimeType = "image/jpeg";
      break;
    case "png":
      mimeType = "image/png";
      break;
    default:
      throw new Error("Unsupported file type");
  }

  // Tạo một Blob từ binary data với loại MIME xác định
  let blob = new Blob([bytes.buffer], { type: mimeType });
  return blob;
}

export function downloadBase64File(
  base64String: string,
  fileName: string,
  typeFile: string
) {
  const blob = base64ToBlob(base64String, typeFile);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  link.click();
  // Giải phóng URL object sau khi tải xuống
  URL.revokeObjectURL(url);
}

export function generateKey(key: string, rkb: string[], rk: string[]) {
  // Key generation
  // --hex to binary
  key = hex2bin(key);

  // --parity bit drop table
  let keyp = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
    27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46,
    38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
  ];

  // getting 56 bit key from 64 bit using the parity bits
  key = permute(key, keyp, 56);

  // Number of bit shifts
  let shift_table = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  // Key- Compression Table : Compression of key from 56 bits to 48 bits
  let key_comp = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
    20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32,
  ];

  // Splitting
  let left = key.slice(0, 28); // rkb for RoundKeys in binary
  let right = key.slice(28, 56); // rk for RoundKeys in hexadecimal

  for (let i = 0; i < 16; i++) {
    // Shifting the bits by nth shifts by checking from shift table
    left = shift_left(left, shift_table[i]);
    right = shift_left(right, shift_table[i]);

    // Combination of left and right string
    let combine_str = left + right;

    // Compression of key from 56 to 48 bits
    let round_key = permute(combine_str, key_comp, 48);

    rkb.push(round_key);
    rk.push(bin2hex(round_key));
  }
}

export function generateRandomHex(): string {
  const characters = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
