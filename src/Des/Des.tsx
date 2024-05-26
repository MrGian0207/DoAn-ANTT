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
import Loading from "../components/Loading";

export default function Des() {
  const [fileEncrypt, setFileEncrypt] = useState<File | null>(null);
  const [fileDecrypt, setFileDecrypt] = useState<File | null>(null);
  const [typeFileEncrypt, setTypeFileEncrypt] = useState<string | null>("docx");
  const [typeFileDecrypt, setTypeFileDecrypt] = useState<string | null>("docx");

  const [keyEncrypt, setKeyEncrypt] = useState<string>("");
  const [keyDecrypt, setKeyDecrypt] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const lengthEncrypt_Decrypt: number = 640;

  const handleGenarateRandomKey = () => {
    setKeyEncrypt(generateRandomHex());
  };

  const isValidHexKey = (key: string) => /^[0-9A-Fa-f]{16}$/.test(key);

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
        let processedHex = isEncrypt
          ? bin2hex(encrypt(subString, rkb, rk))
          : bin2hex(encrypt(subString, rkb.reverse(), rk.reverse()));
        resultHex += processedHex;
      }
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
      setIsLoading(false); // Stop loading when file download is done
    };

    reader.onerror = function (error) {
      console.error("Error occurred while reading file:", error);
      setIsLoading(false); // Stop loading when file download is done
    };

    reader.readAsDataURL(file as File);
  };

  const handleEncrypt = () => {
    if (!fileEncrypt) {
      alert("Please provide a file to encrypt");
    } else if (keyEncrypt.length === 0) {
      alert("Please provide a key encryption");
    } else if (keyEncrypt.length !== 16) {
      alert("keyEncrypt must be 16 characters");
    } else if (!isValidHexKey(keyEncrypt.toUpperCase())) {
      alert("KeyDecrypt must only contain characters from 0123456789ABCDEF");
    } else {
      setIsLoading(true); // Start loading when encryption starts
      setKeyEncrypt(keyEncrypt);
      handleFileRead(true, fileEncrypt, keyEncrypt.toUpperCase());
    }
  };

  const handleDecrypt = () => {
    if (!fileDecrypt) {
      alert("Please provide a file to decrypt");
    } else if (keyDecrypt.length === 0) {
      alert("Please provide a key decryption");
    } else if (keyEncrypt.length !== 16) {
      alert("keyDecrypt must be 16 characters");
    } else if (!isValidHexKey(keyDecrypt.toUpperCase())) {
      alert("KeyDecrypt must only contain characters from 0123456789ABCDEF");
    } else {
      setIsLoading(true); // Start loading when encryption starts
      setKeyDecrypt(keyDecrypt);
      handleFileRead(false, fileDecrypt, keyDecrypt.toUpperCase());
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-row gap-20 justify-center items-center">
      {isLoading && <Loading />}
      {/* Conditionally render the Loading component */}
      {!isLoading && (
        <>
          <section className="flex flex-col gap-10 p-10 rounded-md border-dashed border-black border-2">
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
              onChange={(e) => {
                setKeyEncrypt(e.target.value);
              }}
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
          <section className="flex flex-col gap-10 p-10 rounded-md border-dashed border-black border-2">
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
        </>
      )}
    </main>
  );
}
