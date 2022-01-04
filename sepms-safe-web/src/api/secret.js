import CryptoJS from "crypto-js"

export function encryptByDES(message) {
    const keyHex = CryptoJS.enc.Utf8.parse(
      "cf410f8f9a4a42cc7a7f48fc4134e8f9"
    );
    const encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
}
