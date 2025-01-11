/** @type {import('jest').Config} */
module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
testPathIgnorePatterns: ['/node_modules/', '/dist/'],
coverageDirectory: 'coverage',
coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
transform: {
    '^.+\\.ts$': 'ts-jest'
}
};

