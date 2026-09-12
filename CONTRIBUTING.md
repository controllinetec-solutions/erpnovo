# Guia de Contribuição - ERP Lite

Obrigado por considerar contribuir com o ERP Lite! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto segue o [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Ao participar, você concorda em seguir estas diretrizes.

## 🚀 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](../../issues)
2. Se não existir, crie uma nova issue usando o template de bug
3. Inclua:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)
   - Ambiente (OS, navegador, versão)

### Sugerindo Melhorias

1. Verifique se a sugestão já existe nas [Issues](../../issues)
2. Crie uma nova issue com o label `enhancement`
3. Descreva:
   - O problema que a melhoria resolve
   - A solução proposta
   - Alternativas consideradas
   - Impacto esperado

### Submetendo Código

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/erp-lite.git
   cd erp-lite
   ```

3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

4. **Faça suas alterações** seguindo os padrões do projeto

5. **Teste** suas alterações:
   ```bash
   # Frontend
   npm run typecheck
   npm run build

   # Backend
   cd backend
   npm test
   ```

6. **Commit** suas mudanças com mensagens claras:
   ```bash
   git commit -m "feat: adicionar módulo de compras"
   ```

   Use conventional commits:
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `docs:` documentação
   - `style:` formatação
   - `refactor:` refatoração
   - `test:` testes
   - `chore:` manutenção

7. **Push** para seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```

8. **Abra um Pull Request** no repositório original

## 💻 Padrões de Código

### TypeScript

- Use TypeScript strict mode
- Defina tipos explícitos para funções
- Evite `any` quando possível
- Use interfaces para objetos

```typescript
// ✅ Bom
interface Product {
  id: string;
  name: string;
  price: number;
}

function calculateTotal(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.price, 0);
}

// ❌ Ruim
function calculateTotal(products: any): any {
  return products.reduce((sum: any, p: any) => sum + p.price, 0);
}
```

### React

- Use componentes funcionais com hooks
- Nomeie componentes com PascalCase
- Use TypeScript para props
- Mantenha componentes pequenos e focados

```typescript
// ✅ Bom
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
}
```

### Backend

- Siga a estrutura de módulos
- Use middleware para autenticação
- Valide todos os inputs com Zod
- Trate erros adequadamente

```typescript
// ✅ Bom
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    // ... lógica
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ error: error.flatten() });
    }
    next(error);
  }
});
```

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adicionar módulo de compras
fix: corrigir cálculo de estoque
docs: atualizar README
style: formatar código com Prettier
refactor: extrair componente de botão
test: adicionar testes para produtos
chore: atualizar dependências
```

### Pull Requests

- **Título claro** descrevendo a mudança
- **Descrição** explicando o que e por que
- **Screenshots** para mudanças visuais
- **Testes** passando
- **Documentação** atualizada (se aplicável)
- **Issues relacionadas** mencionadas

## 🧪 Testes

### Frontend

```bash
# Verificar tipos
npm run typecheck

# Build de produção
npm run build
```

### Backend

```bash
# Testes unitários
npm test

# Coverage
npm run test:coverage
```

### Escrevendo Testes

```typescript
// backend/src/modules/products/products.test.ts
import { describe, it, expect } from 'vitest';

describe('Products Module', () => {
  it('should create a product', async () => {
    const product = await createProduct({
      name: 'Test Product',
      price: 10.00,
    });
    
    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
  });
});
```

## 📚 Documentação

- Atualize o README se necessário
- Documente novas APIs no OpenAPI spec
- Adicione comentários em código complexo
- Mantenha a documentação em português

## 🔄 Processo de Review

1. **CI/CD** roda automaticamente
2. **Mantenedor** revisa o código
3. **Feedback** é fornecido (se necessário)
4. **Aprovação** de pelo menos 1 mantenedor
5. **Merge** após aprovação

## 🎯 Áreas que Precisam de Ajuda

- [ ] Testes automatizados
- [ ] Documentação de API
- [ ] Tradução para outros idiomas
- [ ] Integração com novos PDVs
- [ ] Relatórios avançados
- [ ] Performance optimization
- [ ] Acessibilidade (a11y)

## 💬 Comunidade

- **Issues**: Para bugs e features
- **Discussions**: Para dúvidas e ideias
- **Discord/Slack**: (futuro)

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT do projeto.

---

**Obrigado por contribuir com o ERP Lite!** 🚀
