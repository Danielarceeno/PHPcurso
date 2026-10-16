/**
 * data.js — fonte única de verdade do conteúdo do curso.
 * Cada aula: id, day, title, summary, explanation, code (PHP 8+, testado),
 * challenge (desafio opcional) e video_url (null até o vídeo existir).
 */

const LESSONS = [
  // ---------------- DIA 1 ----------------
  {
    id: 1,
    day: 1,
    title: 'Introdução ao PHP',
    summary: 'O que é PHP e para que ele serve.',
    explanation: `PHP é uma linguagem de programação criada para a web. Ela roda no
servidor: quando alguém acessa um site feito em PHP, o servidor executa o código
e envia o resultado (geralmente HTML) para o navegador da pessoa. É a linguagem
por trás de sites como WordPress, Wikipedia e boa parte da internet.`,
    code: `<?php
// Este é um comentário: o PHP ignora esta linha ao executar.

// "echo" envia texto para a tela (ou para a resposta do servidor).
echo "Olá, mundo! Este é o meu primeiro código em PHP.";
`,
    challenge: 'Troque o texto do echo para uma frase se apresentando, com seu nome.',
    video_url: 'https://drive.google.com/file/d/1r2NLbr93jvCMq_emU13Ux93A2pVXnn6s/view?usp=sharing',
  },
  {
    id: 2,
    day: 1,
    title: 'Instalando e executando PHP',
    summary: 'Como rodar PHP no seu computador.',
    explanation: `Para executar PHP você precisa do interpretador instalado. Depois de
instalado, qualquer arquivo com extensão ".php" pode ser rodado direto pelo
terminal com o comando "php nome-do-arquivo.php". Não é preciso navegador nem
servidor para testar um script simples.`,
    code: `<?php
// Salve este conteúdo como "ola.php" e rode no terminal com:
//   php ola.php

echo "PHP está funcionando na sua máquina!" . PHP_EOL;
echo "Versão do PHP em uso: " . phpversion();
`,
    challenge: 'Rode "php -v" no seu terminal e confira qual versão do PHP está instalada.',
    video_url: 'https://drive.google.com/file/d/11f7sEAadPu4_VrcZmmFtbODxv3nBa0rd/view?usp=sharing',
  },
  {
    id: 3,
    day: 1,
    title: 'Sintaxe básica do PHP',
    summary: 'Tags, ponto e vírgula e comentários.',
    explanation: `Todo código PHP fica entre as tags "<?php" e "?>" (a tag de
fechamento pode ser omitida em arquivos que só têm PHP). Cada instrução termina
com ponto e vírgula ";". Comentários podem ser feitos com "//" (linha única) ou
"/* */" (várias linhas).`,
    code: `<?php

// Comentário de uma linha

/*
  Comentário
  de várias linhas
*/

echo "Toda linha de instrução termina com ponto e vírgula.";
echo "\\n"; // \\n cria uma quebra de linha
echo "Esta é a segunda linha.";
`,
    challenge: 'Adicione um comentário explicando o que a segunda linha de echo faz.',
    video_url: 'https://drive.google.com/file/d/1x-R5BIz2zIekaVlJWZpV0xgSJyDPbEff/view?usp=sharing',
  },

  // ---------------- DIA 2 ----------------
  {
    id: 4,
    day: 2,
    title: 'Variáveis',
    summary: 'Guardando valores para usar depois.',
    explanation: `Uma variável é um espaço na memória com um nome, usado para guardar
um valor. Em PHP, toda variável começa com o símbolo "$", seguido do nome
(sem espaços e sem começar com número). O valor pode mudar ao longo do programa.`,
    code: `<?php

$nome = "Maria";
$idade = 28;

echo "Nome: " . $nome . PHP_EOL;
echo "Idade: " . $idade . PHP_EOL;

// O valor de uma variável pode ser alterado depois
$idade = $idade + 1;
echo "Ano que vem: " . $idade . PHP_EOL;
`,
    challenge: 'Crie uma variável $cidade com o nome da sua cidade e exiba-a com echo.',
    video_url: 'https://drive.google.com/file/d/1Mc-lfn3yt3Jz7TaI_JhlcxSbI3Hl0Iji/view?usp=sharing',
  },
  {
    id: 5,
    day: 2,
    title: 'Tipos de dados',
    summary: 'string, int, float, bool e array.',
    explanation: `Todo valor em PHP tem um tipo. Os principais tipos básicos são:
"string" (texto), "int" (número inteiro), "float" (número decimal), "bool"
(verdadeiro ou falso) e "array" (uma lista de valores). PHP descobre o tipo
sozinho, mas você pode checar com a função "gettype()".`,
    code: `<?php

$texto  = "Olá";        // string
$numero = 42;            // int
$preco  = 19.90;         // float
$ativo  = true;          // bool
$lista  = [1, 2, 3];     // array

echo gettype($texto) . PHP_EOL;
echo gettype($numero) . PHP_EOL;
echo gettype($preco) . PHP_EOL;
echo gettype($ativo) . PHP_EOL;
echo gettype($lista) . PHP_EOL;
`,
    challenge: 'Crie uma variável com o seu tipo favorito e imprima o resultado de gettype() dela.',
    video_url: 'https://drive.google.com/file/d/1_ZWe5EOoTK-DPJMkQFCSUnfaGS5MnSYp/view?usp=sharing',
  },
  {
    id: 6,
    day: 2,
    title: 'Operadores matemáticos e de atribuição',
    summary: 'Soma, subtração, multiplicação, divisão e formas curtas de atualizar variáveis.',
    explanation: `PHP tem os operadores matemáticos básicos: "+" (soma), "-"
(subtração), "*" (multiplicação), "/" (divisão), "%" (resto da divisão) e "**"
(potência). Já os operadores de atribuição guardam um valor numa variável — o
mais comum é "=", mas existem versões curtas que fazem uma conta e já
atualizam a variável no mesmo passo: "+=" soma e atribui, "-=" subtrai e
atribui, "*=" multiplica e atribui, "/=" divide e atribui. "$a += 5" é o
mesmo que escrever "$a = $a + 5", só que mais curto.`,
    code: `<?php

$a = 10;
$b = 3;

echo "Soma: " . ($a + $b) . PHP_EOL;
echo "Subtração: " . ($a - $b) . PHP_EOL;
echo "Multiplicação: " . ($a * $b) . PHP_EOL;
echo "Divisão: " . ($a / $b) . PHP_EOL;
echo "Resto: " . ($a % $b) . PHP_EOL;
echo "Potência: " . ($a ** 2) . PHP_EOL;

// Operadores de atribuição: fazem a conta e já guardam o resultado
$saldo = 100;
$saldo += 50; // o mesmo que $saldo = $saldo + 50;
echo "Depois do depósito: " . $saldo . PHP_EOL;

$saldo -= 30; // o mesmo que $saldo = $saldo - 30;
echo "Depois do saque: " . $saldo . PHP_EOL;
`,
    challenge: 'Calcule a área de um retângulo de base 5 e altura 8 usando o operador *, depois use += para somar 10 ao resultado.',
    video_url: null,
  },

  // ---------------- DIA 3 ----------------
  {
    id: 7,
    day: 3,
    title: 'Operadores matemáticos e de atribuição (continuação)',
    summary: 'Mais exemplos praticando os operadores da aula anterior.',
    explanation: `Esta aula é uma continuação direta da aula anterior: em vez de
conteúdo novo, é hora de praticar mais os operadores matemáticos e de
atribuição com exemplos aplicados. Assista ao material complementar
(link abaixo) para ver outras situações do dia a dia resolvidas com esses
operadores antes de seguir para os operadores de comparação.`,
    code: `<?php

// Praticando operadores de atribuição em sequência
$pontuacao = 0;

$pontuacao += 10; // ganhou 10 pontos
$pontuacao += 25; // ganhou mais 25 pontos
$pontuacao -= 5;  // perdeu 5 pontos
$pontuacao *= 2;  // pontuação em dobro (bônus)

echo "Pontuação final: " . $pontuacao . PHP_EOL;

$preco = 200;
$preco /= 4; // dividido em 4 parcelas
echo "Valor de cada parcela: " . $preco . PHP_EOL;
`,
    challenge: 'Simule o carrinho de uma loja: comece com $total = 0 e use += para somar o preço de 3 produtos diferentes.',
    video_url: 'https://drive.google.com/file/d/14Q-e8Tk8HBlwW63i3XSveUVmhfY_j1j-/view?usp=sharing',
  },
  {
    id: 8,
    day: 3,
    title: 'Operadores de comparação',
    summary: 'Comparando valores: igual, maior, menor.',
    explanation: `Operadores de comparação retornam sempre "true" ou "false".
Os principais são: "==" (igual em valor), "===" (igual em valor e tipo), "!="
(diferente), ">" (maior), "<" (menor), ">=" e "<=". Prefira sempre "===" para
evitar comparações inesperadas entre tipos diferentes.`,
    code: `<?php

$idade = 18;

var_dump($idade == "18");   // true  (compara só o valor)
var_dump($idade === "18");  // false (tipos diferentes: int vs string)
var_dump($idade > 17);      // true
var_dump($idade <= 18);     // true
var_dump($idade != 20);     // true
`,
    challenge: 'Compare duas variáveis com === e explique em um comentário por que o resultado deu true ou false.',
    video_url: 'https://drive.google.com/file/d/157DQBmesGCg-MGVuiL4YOS1fkuLr5aWH/view?usp=sharing',
  },
  {
    id: 9,
    day: 3,
    title: 'Operadores lógicos',
    summary: 'Combinando condições com && (e), || (ou) e ! (não).',
    explanation: `Operadores lógicos combinam expressões que resultam em "true" ou
"false". "&&" (e) exige que ambos os lados sejam verdadeiros; "||" (ou) exige que
pelo menos um lado seja verdadeiro; "!" (não) inverte o valor.`,
    code: `<?php

$temIngresso = true;
$idade = 20;

$podeEntrar = $temIngresso && $idade >= 18;
echo "Pode entrar? " . ($podeEntrar ? "sim" : "não") . PHP_EOL;

$feriadoOuFimDeSemana = false || true;
echo "Está de folga? " . ($feriadoOuFimDeSemana ? "sim" : "não") . PHP_EOL;

echo "Negação: " . (!$temIngresso ? "sem ingresso" : "com ingresso") . PHP_EOL;
`,
    challenge: 'Crie uma condição que só é verdadeira se a pessoa for maior de idade E tiver carteira de motorista.',
    video_url: 'https://drive.google.com/file/d/1uAMPMD6LDwW4FO0XyupeQpg1hrv2ZLcL/view?usp=sharing',
  },

  // ---------------- DIA 4 ----------------
  {
    id: 10,
    day: 4,
    title: 'Estruturas condicionais com if e else',
    summary: 'Tomando decisões no código.',
    explanation: `"if" executa um bloco de código somente se a condição entre
parênteses for verdadeira. "else" executa um bloco alternativo caso a condição
seja falsa. Também existe "elseif" para testar várias condições em sequência.`,
    code: `<?php

$nota = 7.5;

if ($nota >= 7) {
    echo "Aprovado" . PHP_EOL;
} elseif ($nota >= 5) {
    echo "Recuperação" . PHP_EOL;
} else {
    echo "Reprovado" . PHP_EOL;
}
`,
    challenge: 'Escreva um if/else que diga se um número é par ou ímpar (dica: use o operador %).',
    video_url: 'https://drive.google.com/file/d/14hDgqcTeST0RZXqnX51D5kbn4Ia8RTkC/view?usp=sharing',
  },
  {
    id: 11,
    day: 4,
    title: 'Estrutura switch',
    summary: 'Comparando um valor com várias opções.',
    explanation: `"switch" compara uma variável com vários valores possíveis, um por
"case". É útil quando há muitas opções para testar, evitando uma longa cadeia
de "elseif". Não esqueça do "break" ao final de cada case, e do "default" para
o caso em que nada corresponde.`,
    code: `<?php

$diaDaSemana = 3;

switch ($diaDaSemana) {
    case 1:
        echo "Segunda-feira";
        break;
    case 2:
        echo "Terça-feira";
        break;
    case 3:
        echo "Quarta-feira";
        break;
    default:
        echo "Outro dia";
}
`,
    challenge: 'Adicione os cases para quinta, sexta, sábado e domingo.',
    video_url: null,
  },

  // ---------------- DIA 5 ----------------
  {
    id: 12,
    day: 5,
    title: 'Arrays',
    summary: 'Guardando várias informações em uma única variável.',
    explanation: `Um array é uma lista de valores guardados em uma única variável.
Cada item tem uma posição (índice), começando em 0. Você acessa um item usando
colchetes: "$lista[0]" pega o primeiro item.`,
    code: `<?php

$frutas = ["maçã", "banana", "laranja"];

echo $frutas[0] . PHP_EOL; // maçã
echo $frutas[1] . PHP_EOL; // banana

$frutas[] = "uva"; // adiciona um novo item ao final
echo "Total de frutas: " . count($frutas) . PHP_EOL;
`,
    challenge: 'Crie um array com 3 filmes favoritos e exiba o segundo item dele.',
    video_url: null,
  },
  {
    id: 13,
    day: 5,
    title: 'Arrays associativos',
    summary: 'Arrays com chaves nomeadas em vez de números.',
    explanation: `Em um array associativo, cada valor tem uma chave com nome, em vez
de um número. Isso deixa o código mais legível quando os dados representam
propriedades de algo, como uma pessoa ou um produto.`,
    code: `<?php

$aluno = [
    "nome"  => "João",
    "idade" => 22,
    "curso" => "PHP",
];

echo $aluno["nome"] . " tem " . $aluno["idade"] . " anos." . PHP_EOL;

$aluno["idade"] = 23; // atualizando um valor existente
echo "Novo valor: " . $aluno["idade"] . PHP_EOL;
`,
    challenge: 'Crie um array associativo para um produto com "nome" e "preco", depois exiba os dois valores.',
    video_url: null,
  },

  // ---------------- DIA 6 ----------------
  {
    id: 14,
    day: 6,
    title: 'Estrutura de repetição for',
    summary: 'Repetindo um bloco de código um número definido de vezes.',
    explanation: `O laço "for" repete um bloco de código enquanto uma condição for
verdadeira, controlando um contador. A sintaxe tem três partes: valor inicial,
condição de parada, e o que muda a cada volta.`,
    code: `<?php

for ($i = 1; $i <= 5; $i++) {
    echo "Contando: " . $i . PHP_EOL;
}
`,
    challenge: 'Use um for para exibir apenas os números pares entre 1 e 10.',
    video_url: null,
  },
  {
    id: 15,
    day: 6,
    title: 'Estruturas while e do while',
    summary: 'Repetindo enquanto uma condição for verdadeira.',
    explanation: `"while" testa a condição antes de cada repetição — se ela já
começar falsa, o bloco nunca roda. "do while" testa a condição depois, então o
bloco sempre roda pelo menos uma vez.`,
    code: `<?php

$contador = 1;
while ($contador <= 3) {
    echo "while: " . $contador . PHP_EOL;
    $contador++;
}

$numero = 10;
do {
    echo "do while: " . $numero . PHP_EOL;
    $numero++;
} while ($numero < 10); // roda uma vez mesmo com a condição falsa
`,
    challenge: 'Escreva um while que soma os números de 1 a 10 e imprime o total no final.',
    video_url: null,
  },
  {
    id: 16,
    day: 6,
    title: 'Percorrendo arrays com foreach',
    summary: 'A forma mais simples de passar por todos os itens de um array.',
    explanation: `"foreach" percorre cada item de um array automaticamente, sem
precisar controlar índice nem condição de parada. Para arrays associativos, dá
para pegar a chave e o valor ao mesmo tempo.`,
    code: `<?php

$frutas = ["maçã", "banana", "laranja"];

foreach ($frutas as $fruta) {
    echo "Fruta: " . $fruta . PHP_EOL;
}

$aluno = ["nome" => "Ana", "curso" => "PHP"];

foreach ($aluno as $chave => $valor) {
    echo $chave . ": " . $valor . PHP_EOL;
}
`,
    challenge: 'Use foreach para somar todos os números de um array [4, 8, 15, 16, 23].',
    video_url: null,
  },

  // ---------------- DIA 7 ----------------
  {
    id: 17,
    day: 7,
    title: 'Funções',
    summary: 'Organizando código reutilizável.',
    explanation: `Uma função agrupa um bloco de código que pode ser executado
(chamado) várias vezes, evitando repetição. Ela pode receber parâmetros de
entrada e devolver um valor com "return".`,
    code: `<?php

function saudacao(string $nome): string {
    return "Olá, " . $nome . "!";
}

echo saudacao("Pedro") . PHP_EOL;
echo saudacao("Clara") . PHP_EOL;

function somar(int $a, int $b): int {
    return $a + $b;
}

echo "Soma: " . somar(4, 6) . PHP_EOL;
`,
    challenge: 'Crie uma função "quadrado($n)" que retorna o número elevado ao quadrado.',
    video_url: null,
  },
  {
    id: 18,
    day: 7,
    title: 'Manipulação básica de strings',
    summary: 'Funções úteis para trabalhar com texto.',
    explanation: `PHP tem várias funções prontas para strings: "strlen()" conta
caracteres, "strtoupper()"/"strtolower()" mudam a caixa das letras, "str_replace()"
troca trechos de texto, e "trim()" remove espaços das pontas.`,
    code: `<?php

$frase = "  Aprender PHP é ótimo  ";

echo strlen($frase) . PHP_EOL;
echo strtoupper($frase) . PHP_EOL;
echo strtolower($frase) . PHP_EOL;
echo trim($frase) . PHP_EOL;
echo str_replace("ótimo", "divertido", trim($frase)) . PHP_EOL;
`,
    challenge: 'Use str_replace para trocar uma palavra da frase "Eu gosto de JavaScript" para "PHP".',
    video_url: null,
  },

  // ---------------- DIA 8 ----------------
  {
    id: 19,
    day: 8,
    title: 'Trabalhando com datas',
    summary: 'Exibindo e formatando datas em PHP.',
    explanation: `A função "date()" formata a data e hora atuais do servidor
usando um formato definido por letras: "d" (dia), "m" (mês), "Y" (ano com 4
dígitos), "H:i:s" (hora:minuto:segundo). "time()" retorna o timestamp atual.`,
    code: `<?php

echo date("d/m/Y") . PHP_EOL;        // ex: 17/09/2026
echo date("H:i:s") . PHP_EOL;        // ex: 14:30:00
echo date("d/m/Y H:i:s") . PHP_EOL;

$amanha = time() + (60 * 60 * 24); // agora + 1 dia em segundos
echo "Amanhã: " . date("d/m/Y", $amanha) . PHP_EOL;
`,
    challenge: 'Exiba a data atual no formato "Ano-Mês-Dia" (ex: 2026-09-17).',
    video_url: null,
  },
  {
    id: 20,
    day: 8,
    title: 'Introdução a formulários com PHP',
    summary: 'Recebendo dados enviados por um formulário HTML.',
    explanation: `Quando um formulário HTML é enviado com method="post", os dados
chegam no PHP através da variável superglobal "$_POST", um array associativo
onde a chave é o "name" de cada campo do formulário. Para method="get", os
dados chegam em "$_GET".`,
    code: `<?php
// Supondo um formulário HTML com:
// <input type="text" name="nome">
// <input type="email" name="email">
// <form method="post">

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome  = $_POST["nome"]  ?? "";
    $email = $_POST["email"] ?? "";

    echo "Recebido: " . $nome . " (" . $email . ")" . PHP_EOL;
} else {
    echo "Aguardando envio do formulário." . PHP_EOL;
}
`,
    challenge: 'Monte um formulário HTML simples com um campo "idade" e imprima o valor recebido em $_POST.',
    video_url: null,
  },
];

const DAY_LABELS = {
  1: 'Dia 1',
  2: 'Dia 2',
  3: 'Dia 3',
  4: 'Dia 4',
  5: 'Dia 5',
  6: 'Dia 6',
  7: 'Dia 7',
  8: 'Dia 8',
};

function getLessonById(id) {
  return LESSONS.find((l) => l.id === Number(id));
}

function getLessonsByDay() {
  const days = {};
  for (const lesson of LESSONS) {
    if (!days[lesson.day]) days[lesson.day] = [];
    days[lesson.day].push(lesson);
  }
  return days;
}
