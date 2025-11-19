// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tselint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tselint.configs.recommended,
);
