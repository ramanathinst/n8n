import Cryptr  from "cryptr";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY!);

export const encryption = (text: string) => cryptr.encrypt(text);
export const decryption = (text: string) => cryptr.decrypt(text);