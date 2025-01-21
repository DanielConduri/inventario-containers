module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/config.jest.ts'],  // Apunta al archivo de configuración
    testMatch: ['**/?(*.)+(spec|test).ts'], // Hace coincidir los archivos .spec.ts o .test.ts
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1', // Esto mapea las rutas absolutas
       '^config/config$': '<rootDir>./config/config.ts'
      },
};


  

//   module.exports = {
//     preset: 'jest-preset-angular',
//     setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
//     globalTeardown: '<rootDir>/src/global-teardown.ts',
//     testEnvironment: 'jest-environment-jsdom',
//     transform: {
//       '^.+\\.(ts|html)$': 'ts-jest',
//     },
//     transformIgnorePatterns: ['node_modules/(?!@angular|rxjs)'],
//   };
  