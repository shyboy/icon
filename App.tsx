import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ExampleGallery } from './components/ExampleGallery';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultDisplay } from './components/ResultDisplay';
import { AuthModal } from './components/AuthModal';
import { CreditCounter } from './components/CreditCounter';
import { useAuth } from './hooks/useAuth';
import { generateAvatar } from './services/geminiService';
import type { GenerateFormState } from './types';

export default function App() {
    const [formState, setFormState] = useState<GenerateFormState>({
        image: null,
        text: '',
        position: '底部居中',
    });
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { credits, isLoggedIn, login, useCredit } = useAuth();

    const handleGenerate = useCallback(async () => {
        if (!formState.image) {
            setError('请先上传一张图片。');
            return;
        }
        if (credits <= 0) {
            setError('您的次数已用完，请购买更多。');
            setIsAuthModalOpen(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateAvatar(formState.image, formState.text, formState.position);
            setGeneratedImage(result);
            useCredit();
        } catch (err) {
            setError(err instanceof Error ? err.message : '发生未知错误。');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [formState, credits, useCredit]);

    return (
        <div className="min-h-screen font-sans text-gray-800">
            <main className="container mx-auto px-4 py-8 md:py-16">
                <Header />
                <ExampleGallery />
                <div className="max-w-4xl mx-auto mt-12 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-10 border border-white/30">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                        <GeneratorForm
                            formState={formState}
                            setFormState={setFormState}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                            credits={credits}
                        />
                        <ResultDisplay
                            generatedImage={generatedImage}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                     <CreditCounter credits={credits} onAuthClick={() => setIsAuthModalOpen(true)} />
                </div>
            </main>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={login}
            />
        </div>
    );
}