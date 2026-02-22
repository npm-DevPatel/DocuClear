import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SignupForm({ onSubmit, isLoading, onToggleMode }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto w-full">
            <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                disabled={isLoading}
            />
            <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading}
            />
            <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                helperText="Must be at least 6 characters"
            />
            <Button type="submit" fullWidth isLoading={isLoading} className="mt-6 text-lg py-4">
                Create Account
            </Button>
            <div className="text-center mt-6 pt-4 border-t border-neutral-100">
                <p className="text-[length:var(--font-base)] text-neutral-600">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onToggleMode}
                        className="text-brand-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </form>
    );
}
