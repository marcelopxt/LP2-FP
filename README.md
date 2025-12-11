# Documentação do Projeto: SavePoint

## 1. Visão Geral e Escopo

O objetivo é desenvolver uma Single Page Application (SPA) para gerenciamento pessoal de uma biblioteca de jogos. O sistema deve consumir uma API pública de jogos para obter metadados e persistir as informações do usuário localmente no navegador.

**Público-alvo:** Uso pessoal (Single Player). **Persistência:** Local (Client-side).

---

## 2. Levantamento de Requisitos

### 2.1. Requisitos Funcionais (O que o sistema faz)

- **RF001 - Buscar Jogos:** O sistema deve permitir buscar jogos em uma API externa (ex: RAWG) para adicionar à biblioteca.
- **RF002 - Adicionar Jogo:** O usuário pode salvar um jogo da API na sua lista local (`Meus Jogos`).
- **RF003 - Editar Status:** O usuário deve poder alterar o status do jogo. Opções: _Quero Jogar, Jogando, Zerado, Abandonado_.
- **RF004 - Avaliar Jogo:** O usuário deve poder atribuir uma nota de 0 a 5 estrelas.
- **RF005 - Remover Jogo:** O usuário pode remover um jogo de sua lista.
- **RF006 - Visualizar Estatísticas:** O Painel deve calcular automaticamente os gêneros mais jogados baseados na lista local.
- **RF007 - Recomendação:** O sistema deve sugerir jogos baseados no gênero mais frequente na biblioteca do usuário.

### 2.2. Requisitos Não-Funcionais (Como o sistema é)

- **RNF01 - Tecnologia:** React.js.
- **RNF02 - Armazenamento:** `AsyncStorage`.
- **RNF03 - API Externa:** **RAWG.io API**.

---

## 3. Modelagem de Dados

Como usaremos armazenamento local, sua "tabela" será um Array de Objetos JSON salvo como uma string.

**Chave de Armazenamento:** `@game_library`

**Estrutura do Objeto (Schema):**

JSON

```
[
  {
    "id": 3498,                // ID original da API (para evitar duplicatas)
    "title": "Grand Theft Auto V",
    "image_url": "https://media.rawg.io/...",
    "genres": ["Action", "Adventure"], // Array de strings para facilitar o gráfico
    "summary": "Um jogo de mundo aberto...",
    "status": "Zerado",        // Enum: 'Quero Jogar' | 'Jogando' | 'Zerado'
    "rating": 5,               // Int: 0 a 5
    "added_at": "2023-10-27T10:00:00Z" // Para ordenação
  }
]
```

---

## 4. Detalhamento e Lógica das Telas

### Tela 1: Painel (Dashboard)

Esta é uma tela puramente **analítica**. Ela não edita dados, apenas lê e processa.

1. **Jogos Mais Jogados (Top 3):**
   - _Lógica:_ Filtrar jogos com status "Jogando" ou "Zerado" -> Ordenar por `rating` (decrescente) -> Pegar os 3 primeiros.
2. **Gêneros Preferidos (Gráfico):**
   - _Lógica:_ Percorrer todo o array de jogos -> Contar a frequência de cada string no array `genres` -> Calcular a porcentagem.
   - _Dica:_ Use uma biblioteca simples como `Chart.js` ou `Recharts` para o gráfico de pizza (Pie Chart).
3. **Info Resumida:**
   - Exibir "Total de Jogos Salvos", "Total Zerados" e "Backlog" (Quero Jogar).

### Tela 2: Meus Jogos (A Lista)

Esta é a tela de **CRUD**.

1. **Listagem:**
   - Renderizar cards usando o array salvo no Storage.
   - Permitir filtro simples (ex: mostrar só os "Jogando").
2. **Card do Jogo:**
   - Deve ter um `Select` ou `Dropdown` para mudar o Status imediatamente.
   - Deve ter 5 ícones de estrela clicáveis para atualizar o Rating.
3. **Botão "Adicionar Novo":**
   - Abre um Modal ou vai para uma tela de busca que consulta a API da RAWG. Ao selecionar um jogo, cria o objeto JSON e dá `push` no array local.

### Tela 3: Populares (Recomendação)

Esta tela mistura dados locais com dados da API.

1. **Algoritmo de Recomendação:**
   - **Passo 1:** Ler o `localStorage`.
   - **Passo 2:** Identificar o gênero mais repetido (ex: "RPG"). _Se a lista estiver vazia, usar um padrão como "Action"._
   - **Passo 3:** Fazer uma requisição `GET` para a API filtrando por esse gênero.
   - _Exemplo URL RAWG:_ `https://api.rawg.io/api/games?genres=role-playing-games-rpg&ordering=-metacritic`
2. **Exibição:**
   - Mostrar a lista retornada pela API.
   - **Importante:** Adicione um botão "Adicionar à Biblioteca" nestes cards para criar um ciclo de feedback rápido.

---

## 5. Planejamento de Implementação

Aqui está um diagrama conceitual de como os dados fluem entre a API, o seu armazenamento local e as telas do usuário.

### Fase 1: Configuração e API

1. Crie o projeto (Vite/React ou Dashboard React App).
2. Cadastre-se na [RAWG.io](https://rawg.io/apidocs) e pegue sua API Key.
3. Crie um serviço simples (`api.js`) para buscar jogos por nome.

### Fase 2: O CRUD (Tela "Meus Jogos")

1. Crie a função de salvar/ler no LocalStorage.
   - _Dica:_ Crie um "Hook" customizado, ex: `useGameStorage()`.
2. Implemente a busca na API e o botão de "Salvar".
3. Implemente a listagem e a edição de Status/Nota.

### Fase 3: O Painel e Inteligência

1. Implemente a lógica de contar gêneros.
2. Implemente o gráfico.
3. Implemente a tela "Populares" buscando na API com base no gênero top 1.

---

## 6. Dicas Técnicas

### Tratando o LocalStorage

Como o LocalStorage só aceita strings, você precisa de dois métodos auxiliares para não quebrar a cabeça:

JavaScript

```
// helpers/storage.js

const KEY = "@game_library";

export const getStoredGames = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveGame = (newGame) => {
  const currentGames = getStoredGames();
  // Evitar duplicados
  if (currentGames.find(g => g.id === newGame.id)) return;

  const updated = [...currentGames, newGame];
  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const updateGame = (gameId, updates) => {
  const currentGames = getStoredGames();
  const updated = currentGames.map(game =>
    game.id === gameId ? { ...game, ...updates } : game
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
};
```

### Paleta de Cores Sugerida (Tema "Gamer")

Para ficar bonito no portfólio/trabalho:

- **Fundo:** `#121212` (Dark Grey)
- **Cards:** `#1E1E1E` (Lighter Grey)
- **Acento/Botões:** `#7000FF` (Roxo Neon) ou `#00FF9D` (Verde Cyberpunk)
- **Texto:** `#E0E0E0`




### CHAVE API
# c0c4d37b298f40fc83e906c279bbe0f2