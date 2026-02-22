import React from 'react';
import { Share, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';

export function ShareSheet({ title, textToShare }) {
    const [copied, setCopied] = React.useState(false);
    const { addToast } = useToast();

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Simplified Document',
                    text: textToShare,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textToShare).then(() => {
            setCopied(true);
            addToast({ type: 'success', message: 'Text copied to clipboard' });
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex gap-2">
            {navigator.share && (
                <Button variant="secondary" onClick={handleNativeShare} className="gap-2">
                    <Share size={20} />
                    <span>Share</span>
                </Button>
            )}
            <Button variant="secondary" onClick={copyToClipboard} className="gap-2">
                {copied ? <Check size={20} className="text-brand-success" /> : <Copy size={20} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
        </div>
    );
}
