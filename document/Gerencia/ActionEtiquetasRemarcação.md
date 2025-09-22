Lógica de funcionamento tela Etiquetas de Remarcação

1. Digite o valor que será inserido na etiqueta [x]

2. após inserir o valor exiba os btns imprimir  e guardar  [x]
    2.1.se o usuario acionar imprimir abra um swal para digitar a quantidade de etiquetas se confimar exibir a quantidade de etiquetas [x]
    2.2. se o usuario acionar btn voltar apague as quantidades digitadass anteriormente [x]

    3. se o usuario acionar o btn guardar abra o swal para digitar a quantidade de etiquetas e envie para a tabela [X]
    3.1 se o usuario acionar btn voltar apague as quantidades digitadass anteriormente [x]
    3.2 quantidade, na tabela é a quantidade de etiquetas a ser impressa. [x]
    3.3 será exibido um input de quantidade cópias das páginas das etiquetas cada página terá 4 etiquetas ou seja 
        toda vez que alterar a quantidades de copias a será multiplicada as páginas existentes das etiquetas.
    3.4 tera um tbn excluir para apagar as etiquetas da tabela da coluna selecionada [x]

4. btn excluir todos apagar todas as etiquetas da tabela [x]

# Documentação de Implementação: Tela de Etiquetas de Remarcação

Esta documentação descreve a implementação da tela de etiquetas de remarcação em um projeto React.js. A funcionalidade permite que os usuários insiram valores, imprimam etiquetas e gerenciem quantidades.

## Funcionalidades

### 1. Inserção de Valor
- O usuário deve inserir o valor que será exibido na etiqueta.

### 2. Exibição de Botões
- Após a inserção do valor, os botões "Imprimir" e "Guardar" são exibidos.

#### 2.1. Botão Imprimir
- Ao clicar em "Imprimir", um diálogo (usando `swal`) é aberto para que o usuário insira a quantidade de etiquetas.
- Se confirmado, a quantidade de etiquetas é exibida.

#### 2.2. Botão Voltar
- Se o usuário clicar em "Voltar", as quantidades digitadas anteriormente são apagadas.

### 3. Botão Guardar
- Ao clicar em "Guardar", um diálogo (usando `swal`) é aberto para que o usuário insira a quantidade de etiquetas, que é então enviada para a tabela.

#### 3.1. Botão Voltar
- Similar ao botão "Imprimir", clicar em "Voltar" apaga as quantidades digitadas anteriormente.

#### 3.2. Quantidade na Tabela
- Refere-se à quantidade de etiquetas a serem impressas.

#### 3.3. Cópias das Páginas
- Um input é exibido para a quantidade de cópias das páginas das etiquetas. Cada página contém 4 etiquetas. Alterar a quantidade de cópias multiplica as páginas existentes.

#### 3.4. Botão Excluir
- Um botão "Excluir" está disponível para apagar as etiquetas da coluna selecionada na tabela.

### 4. Botão Excluir Todos
- Um botão para apagar todas as etiquetas da tabela.

## Implementação

### Componentes React
- **EtiquetaInput**: Componente para entrada de valores.
- **BotaoImprimir**: Componente para o botão de impressão.
- **BotaoGuardar**: Componente para o botão de guardar.
- **TabelaEtiquetas**: Componente para exibir e gerenciar etiquetas.

### Bibliotecas Utilizadas
- **SweetAlert2**: Para diálogos de confirmação e entrada de dados.

### Exemplo de Uso

