module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Documentação
        'style',    // Formatação (não afeta código)
        'refactor', // Refatoração
        'perf',     // Performance
        'test',     // Testes
        'build',    // Build/dependências
        'ci',       // CI/CD
        'chore',    // Manutenção
        'revert',   // Reverter commit
      ],
    ],
    'subject-case': [0], // Permite qualquer case no subject
    'body-max-line-length': [0], // Sem limite no body
  },
};
