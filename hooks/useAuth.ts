import { useState, useEffect, useCallback } from 'react';
import { ACCOUNT_KEYS } from '../constants';

const CREDITS_KEY = 'avatarGeneratorCredits';
const ACCOUNT_KEY = 'avatarGeneratorAccountKey';
const USED_KEYS_KEY = 'usedAvatarGeneratorKeys'; // Key to store used activation keys

export const useAuth = () => {
    const [credits, setCredits] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        try {
            const storedKey = localStorage.getItem(ACCOUNT_KEY);
            if (storedKey && ACCOUNT_KEYS.includes(storedKey)) {
                const storedCredits = localStorage.getItem(CREDITS_KEY);
                setCredits(storedCredits ? parseInt(storedCredits, 10) : 0);
                setIsLoggedIn(true);
            } else {
                // New user, give 1 free credit
                const storedCredits = localStorage.getItem(CREDITS_KEY);
                if (storedCredits === null) {
                    localStorage.setItem(CREDITS_KEY, '1');
                    setCredits(1);
                } else {
                    setCredits(parseInt(storedCredits, 10));
                }
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("访问localStorage时出错:", error);
            // Fallback for environments where localStorage is disabled
            setCredits(1);
        }
    }, []);

    const login = useCallback((key: string): { success: boolean; message?: string } => {
        try {
            const usedKeys: string[] = JSON.parse(localStorage.getItem(USED_KEYS_KEY) || '[]');

            if (usedKeys.includes(key)) {
                return { success: false, message: '此兑换码已被使用。' };
            }

            if (ACCOUNT_KEYS.includes(key)) {
                // Add the key to the used list
                const newUsedKeys = [...usedKeys, key];
                localStorage.setItem(USED_KEYS_KEY, JSON.stringify(newUsedKeys));

                // Grant credits
                localStorage.setItem(ACCOUNT_KEY, key);
                localStorage.setItem(CREDITS_KEY, '10');
                setCredits(10);
                setIsLoggedIn(true);
                return { success: true };
            }

            return { success: false, message: '无效的兑换码，请重试。' };
        } catch (error) {
            console.error("登录过程中出错:", error);
            return { success: false, message: '发生意外错误。' };
        }
    }, []);

    const useCredit = useCallback(() => {
        setCredits(prev => {
            const newCredits = Math.max(0, prev - 1);
            localStorage.setItem(CREDITS_KEY, newCredits.toString());
            return newCredits;
        });
    }, []);

    return { credits, isLoggedIn, login, useCredit };
};