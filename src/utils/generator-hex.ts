class HexGenerator {
    /**
     * 生成指定长度的随机 16 进制字符串
     * @param {number} length - 要生成的字符串长度，默认为 24
     * @returns {string} - 随机生成的 16 进制字符串
     */
    static generateHex(length = 24) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * 16)];
        }
        return result;
    }
}

class ImageUtils {
    /**
     * 将二进制数据（ArrayBuffer）转换为 Base64 编码的图片 URL
     * @param {ArrayBuffer} buffer - 二进制数据
     * @param {string} mimeType - 图片的 MIME 类型（如 "image/png", "image/jpeg"）
     * @returns {Promise<string>} - 返回 Base64 图片 URL
     */
    static arrayBufferToBase64Image(buffer: any, mimeType = 'image/png') {
        return new Promise((resolve, reject) => {
            const blob = new Blob([buffer], { type: mimeType });
            const reader = new FileReader();

            reader.onloadend = () => {
                // 获取 Base64 编码的 Data URL
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(blob); // 将 Blob 转换为 Base64
        });
    }
}


export {
    ImageUtils,
    HexGenerator
}