import CryptoJS from "crypto-js";

export const decryptMessageWithKeyAES = (m: string, key: string) => {
  if (key) {
    if (typeof key === "string") {
      const decodedKey: any = CryptoJS.enc.Base64.parse(key);
      const messDecrypt = CryptoJS.AES.decrypt(m, decodedKey, {
        mode: CryptoJS.mode.ECB,
      }).toString(CryptoJS.enc.Utf8);

      return messDecrypt;
    }
    return "Loi roi ban oi";
  } else {
    return "Error";
  }
};

export const decryptMessage = (m: string, aesKey: CryptoJS.lib.WordArray | null): string => {
  if (aesKey) {
    const messDecrypt = CryptoJS.AES.decrypt(m, aesKey, {
      mode: CryptoJS.mode.ECB,
    }).toString(CryptoJS.enc.Utf8);

    return messDecrypt;
  } else {
    throw "Error";
  }
};

export const encryptMessage = (m: string, aesKey: CryptoJS.lib.WordArray | null): string => {
  if (aesKey) {
    let messEn = CryptoJS.AES.encrypt(m, aesKey, {
      mode: CryptoJS.mode.ECB,
    }).toString();
    return messEn;
  }
  throw "Error";
};

export const checkSenderFromDoctor = (userId: string, senderId: string) => {
  return userId === senderId ? true: false;
}