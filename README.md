# 📱 App de Agendamentos — React Native (Estudo)

App simples para reaprender React Native.  
O usuário digita um nome e adiciona em uma lista de agendamentos.

---

## 🚀 Objetivo do Projeto

Praticar conceitos básicos de React Native:

- useState
- TextInput
- Botões e eventos
- Renderização de listas
- Manipulação de estado com arrays
- Persistência local (AsyncStorage)

---

## API GraphQL

A API GraphQL deste projeto está disponível em um repositório separado:

**🔗 [graphql-appointments](https://github.com/ramonramoscardoso/graphql-appointments)**

### Configuração

1. Clone o repositório da API:

```bash
git clone https://github.com/ramonramoscardoso/graphql-appointments.git
cd graphql-appointments
```

2. Instale as dependências e siga as instruções do README do repositório da API para configurar o ambiente

3. Inicie o servidor GraphQL localmente

4. Configure a URL da API no seu app React Native:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione a variável de ambiente apontando para a API:

```
   API_URL=http://localhost:4000/graphql
```

(Ajuste a porta conforme sua configuração)

### Documentação

Consulte o repositório da API para mais informações sobre:

- Schema GraphQL disponível
- Queries e Mutations suportadas
- Autenticação e autorização
- Exemplos de uso

---

## 🧱 FASE 1 — Estrutura Básica

**Meta:** Conseguir digitar um nome e capturar o valor.

- [x] Criar projeto (preferência: Expo)
- [x] Limpar tela inicial
- [x] Criar estado `nome`
- [x] Criar `TextInput` para o nome
- [x] Criar botão **Adicionar**
- [x] No clique do botão → `console.log(nome)`

---

## 📋 FASE 2 — Lista de Agendamentos

**Meta:** Mostrar os nomes adicionados na tela.

- [x] Criar estado `agendamentos` (array)
- [x] Ao clicar em **Adicionar**:
  - [x] Validar se o nome não está vazio
  - [x] Adicionar nome na lista
  - [x] Limpar o input
- [x] Exibir lista usando **FlatList**

---

## ❌ FASE 3 — Remover Agendamento

**Meta:** Permitir excluir itens da lista.

- [ ] Criar função `removerAgendamento(index)`
- [ ] Adicionar botão **Remover** em cada item
- [ ] Atualizar o estado removendo o item clicado

---

## ✏️ FASE 4 — Melhorias de UX

- [ ] Não permitir adicionar nome vazio
- [ ] Mostrar alerta se estiver vazio
- [ ] Fechar teclado ao adicionar
- [ ] Desabilitar botão se input estiver vazio

---

## 🎨 FASE 5 — Estilização

- [x] Criar `StyleSheet`
- [x] Espaçamento entre elementos
- [x] Estilizar itens da lista como cartões
- [x] Botão com cor personalizada
- [x] Fonte maior para os nomes
