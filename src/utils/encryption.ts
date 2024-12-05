import * as CryptoJS from 'crypto-js';

/**
 * AES 加密函数
 * @param word 要加密的明文
 * @param keyStr 密钥字符串
 * @param ivStr 初始向量字符串
 * @returns 加密后的 Base64 编码密文
 */
export function Encrypt(word: string): string {
    let key = CryptoJS.enc.Utf8.parse('xin$wang@yuan*tp');  // 将密钥字符串转为 WordArray
    let iv = CryptoJS.enc.Utf8.parse('xin$wang@yuan*tp');    // 将初始向量字符串转为 WordArray

    let srcs = CryptoJS.enc.Utf8.parse(word);  // 将明文字符串转为 WordArray
    
    // 使用 AES 加密，CBC 模式，ZeroPadding 填充
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });

    // 返回加密后的 Base64 字符串
    return encrypted.toString();
}