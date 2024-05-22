import Input from "../components/Input";
import Button from "../components/Button";
import Select from "../components/Select";
import { useState } from "react";
import bin2hex, {
  encrypt,
  base64ToHex,
  hexToBase64,
  downloadBase64File,
  generateKey,
  generateRandomHex,
} from "../Algorithm";

export default function Des() {
  const [fileEncrypt, setFileEncrypt] = useState<File | null>(null);
  const [fileDecrypt, setFileDecrypt] = useState<File | null>(null);
  const [typeFileEncrypt, setTypeFileEncrypt] = useState<string | null>("docx");
  const [typeFileDecrypt, setTypeFileDecrypt] = useState<string | null>("docx");

  const [keyEncrypt, setKeyEncrypt] = useState<string>("");
  const [keyDecrypt, setKeyDecrypt] = useState<string>("");

  const lengthEncrypt_Decrypt: number = 640;

  const handleGenarateRandomKey = () => {
    setKeyEncrypt(generateRandomHex());
  };

  const handleFileRead = (
    isEncrypt: boolean,
    file: File | null,
    password: string
  ) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    let rkb: string[] = [];
    let rk: string[] = [];
    

    const reader = new FileReader();

    reader.onload = function (e) {
      let base64Data = (e?.target?.result as string).split(",")[1];

      let baseToHexString = base64ToHex(base64Data);

      let resultHex = "";

      let length = Math.min(lengthEncrypt_Decrypt, baseToHexString.length);
      for (let i = 0; i < length; i += 16) {
        let subString = baseToHexString.substring(i, i + 16).toUpperCase();
        generateKey(password, rkb, rk);
        console.log(subString);
        console.log(isEncrypt);
        let processedHex = isEncrypt
          ? bin2hex(encrypt(subString, rkb, rk))
          : bin2hex(encrypt(subString, rkb.reverse(), rk.reverse()));
        resultHex += processedHex;
      }
      console.log(resultHex);
      baseToHexString =
        resultHex + baseToHexString.slice(lengthEncrypt_Decrypt);
      const hexStringToBase = hexToBase64(baseToHexString.toLowerCase());

      let fileNameWithoutExtension = file?.name
        .split(".")
        .slice(0, -1)
        .join("");
      if (fileNameWithoutExtension.includes("-encrypt")) {
        fileNameWithoutExtension = fileNameWithoutExtension.replace(
          /-encrypt/g,
          ""
        );
      }
      const fileName = isEncrypt
        ? `${fileNameWithoutExtension}-encrypt.${typeFileEncrypt}`
        : `${fileNameWithoutExtension}-decrypt.${typeFileDecrypt}`;
      const typeFile: string | null = isEncrypt
        ? typeFileEncrypt
        : typeFileDecrypt;
      downloadBase64File(hexStringToBase, fileName, typeFile as string);
    };

    reader.onerror = function (error) {
      console.error("Error occurred while reading file:", error);
    };

    reader.readAsDataURL(file as File);
  };

  const handleEncrypt = () => {
    setKeyEncrypt(keyEncrypt);
    handleFileRead(true, fileEncrypt, keyEncrypt);
  };

  const handleDecrypt = () => {
    setKeyDecrypt(keyDecrypt);
    handleFileRead(false, fileDecrypt, keyDecrypt);
  };

  return (
    <main className="w-full min-h-screen flex flex-row gap-20 justify-center items-center">
      <section className="flex flex-col gap-10 p-10 rounded-md border-dashed border-black	border-2">
        <Select
          nameSelect="Encrypt"
          onChange={(e) => {
            setTypeFileEncrypt(e.target.value as string);
          }}
        />
        <Input
          nameInput="file-encrypt"
          setFile={setFileEncrypt}
          typeHandler="Encrypt"
          type={"file"}
        />
        <Input
          type={"text"}
          password={keyEncrypt}
          placeholder="Generate key"
          className="p-3 rounded-md outline-none"
        />
        <Button
          className="bg-gradient-to-r from-cyan-500 to-blue-500"
          onClick={handleGenarateRandomKey}
        >
          Generate key
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-neutral-50"
          onClick={handleEncrypt}
        >
          Encrypt
        </Button>
      </section>
      <section className="flex flex-col gap-10 p-10 rounded-md border-dashed border-black	border-2">
        <Select
          nameSelect="Decrypt"
          onChange={(e) => {
            setTypeFileDecrypt(e.target.value as string);
          }}
        />
        <Input
          nameInput="file-decrypt"
          setFile={setFileDecrypt}
          typeHandler="Decrypt"
          type={"file"}
        />
        <Input
          type={"text"}
          password={keyDecrypt}
          placeholder="Please enter your key to decrypt"
          className="p-3 rounded-md outline-none"
          onChange={(e) => {
            setKeyDecrypt(e.target.value);
          }}
        />
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-neutral-50"
          onClick={handleDecrypt}
        >
          Decrypt
        </Button>
      </section>
    </main>
  );
}
