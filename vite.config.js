import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html'),
                registerSuccess: resolve(__dirname, 'register-success.html'),
                resetPassword: resolve(__dirname, 'reset-password.html'),
                profile: resolve(__dirname, 'profile.html'),
                help: resolve(__dirname, 'help.html'),
                aboutUs: resolve(__dirname, 'about-us.html'),
                chat: resolve(__dirname, 'chat.html')
            }
        }
    }
});