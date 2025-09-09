import { GoogleGenAI, Modality } from "@google/genai";
import { STYLE_REFERENCE_IMAGE_URL } from '../constants';

if (!process.env.API_KEY) {
    console.warn("未设置API_KEY环境变量。正在使用占位密钥。API调用将会失败。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

// Utility to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

// Utility to fetch an image from a URL and convert it to a base64 string
const imageUrlToBase64 = async (url: string): Promise<{ data: string; mimeType: string }> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`无法从 ${url} 获取图片。状态: ${response.status}`);
        }
        const blob = await response.blob();
        const mimeType = blob.type;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve({ data: (reader.result as string).split(',')[1], mimeType });
            reader.onerror = (error) => reject(error);
        });
    } catch (error) {
        console.error("图片URL转base64时出错:", error);
        throw new Error("无法加载风格参考图，请检查您的网络连接。");
    }
};


export const generateAvatar = async (
    userImageFile: File,
    text: string,
    position: string
): Promise<string> => {
    try {
        const userImageBase64 = await fileToBase64(userImageFile);
        const userImageMimeType = userImageFile.type;

        const styleImage = await imageUrlToBase64(STYLE_REFERENCE_IMAGE_URL);

        const prompt = `参考预设图片的风格和样式为用户上传图片的角色生成一个图标，同时只要参考用户上传图片的头部位置，像一个头像图标。图标 ${position} 的文字应该为 "${text}"。如果用户没有提供文字，则不要添加任何文字。`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { // Style reference
                        inlineData: {
                            data: styleImage.data,
                            mimeType: styleImage.mimeType,
                        },
                    },
                    { // User's photo
                        inlineData: {
                            data: userImageBase64,
                            mimeType: userImageMimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }

        throw new Error('未能生成图片。AI可能拒绝了该请求。');

    } catch (error) {
        console.error("使用Gemini API生成头像时出错:", error);
        if (error instanceof Error) {
            throw new Error(`生成头像失败: ${error.message}`);
        }
        throw new Error("生成头像失败，发生未知错误。");
    }
};