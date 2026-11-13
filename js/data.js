/**
 * data.js — fonte única de verdade do conteúdo do curso.
 * Cada aula: id, day, title, summary, explanation, code (PHP 8+, testado),
 * challenge (desafio opcional) e video_url (null até o vídeo existir).
 * extra_videos: [{ label, url }] é opcional, para aula com mais de um vídeo
 * (hoje nenhuma usa: a gravação em duas partes virou as aulas 6 e 7).
 */

const LESSONS = [
  // ---------------- DIA 1 ----------------
  {
    id: 1,
    day: 1,
    title: 'Introdução ao PHP',
    summary: 'Por que o PHP existe e o que ele faz no servidor.',
    explanation: `Os primeiros sites eram estáticos: a mesma página, igual para todo
mundo. Para ter formulários, login e conteúdo que muda de pessoa para pessoa,
era preciso um programa que montasse a página na hora do pedido. O PHP nasceu
dessa necessidade prática: foi criado por Rasmus Lerdorf em 1994, com o nome
"Personal Home Page Tools".

PHP é uma linguagem que roda no servidor: quando alguém acessa um site feito em
PHP, o navegador faz o pedido, o servidor executa o código e devolve o resultado
(geralmente HTML já pronto) para o navegador da pessoa. É a linguagem por trás
de sites como WordPress, Wikipedia e boa parte da internet.`,
    code: `<?php
// Este é um comentário: o PHP ignora esta linha ao executar.

// "echo" envia texto para a tela (ou para a resposta do servidor).
echo "Olá, mundo! Este é o meu primeiro código em PHP.";
`,
    challenge: 'Troque o texto do echo para uma frase se apresentando, com seu nome.',
    video_url: 'https://drive.google.com/file/d/1-nMbAkVardfDDx-I68qFKfLSjUxjF7ji/view?usp=sharing',
  },
  {
    id: 2,
    day: 1,
    title: 'Instalando e executando PHP',
    summary: 'Preparando o computador com XAMPP e VS Code.',
    explanation: `Para executar PHP no seu computador você precisa de um servidor
local. Neste curso usamos o XAMPP, que instala o Apache (o servidor) e o PHP de
uma vez só, e o Visual Studio Code para escrever o código. Depois de instalar,
abra o painel do XAMPP e inicie o Apache.

Os arquivos ".php" ficam na pasta "htdocs" do XAMPP (no Windows,
"C:\\xampp\\htdocs"). Um arquivo "curso.php" salvo ali abre no navegador pelo
endereço "localhost/curso.php"; se ele estiver dentro de uma pasta "arquivos",
o endereço vira "localhost/arquivos/curso.php". Cuidado com o nome do arquivo:
ele precisa terminar em ".php", e é melhor não usar espaços (use "_" no lugar).`,
    code: `<?php
// Salve este conteúdo como "curso.php" dentro da pasta htdocs do XAMPP
// (no Windows: C:\\xampp\\htdocs). Com o Apache ligado, abra no navegador:
//   localhost/curso.php

echo "hello world";
`,
    challenge: 'Crie uma pasta "arquivos" dentro de htdocs, salve o curso.php nela e abra localhost/arquivos/curso.php no navegador.',
    video_url: 'https://drive.google.com/file/d/1VaFHg9nlElZMpRD6-OIvbcFh_XhA7TVy/view?usp=sharing',
  },
  {
    id: 3,
    day: 1,
    title: 'Primeiro código em PHP',
    summary: 'Tags PHP, echo, ponto e vírgula e comentários.',
    explanation: `Todo código PHP fica entre as tags "<?php" e "?>"; o que está fora
delas é HTML comum, por isso os dois podem aparecer no mesmo arquivo. O
servidor executa a parte em PHP e o navegador recebe só o resultado. (Em
arquivos que só têm PHP, a tag de fechamento pode ser omitida.)

"echo" envia um texto para a página, e cada instrução termina com ponto e
vírgula ";" — esquecer dele é o erro mais comum de quem está começando.
Comentários podem ser feitos com "//" (linha única) ou "/* */" (várias linhas)
e não aparecem para quem acessa a página.`,
    code: `<?php
// Comentário de uma linha: o PHP ignora

/*
  Comentário
  de várias linhas
*/

echo "<h1>Meu primeiro código</h1>";
echo "Toda instrução termina com ponto e vírgula.";
echo "<br>"; // <br> quebra a linha na página
echo "Esta é a segunda linha.";
?>

<h2>Fora das tags, o arquivo volta a ser HTML comum.</h2>
`,
    challenge: 'Adicione mais um echo com o seu nome e um comentário explicando o que ele faz.',
    video_url: 'https://drive.google.com/file/d/1ngteLOgAR_hNzkuhMujbm9bn0ZljrNSL/view?usp=sharing',
  },

  // ---------------- DIA 2 ----------------
  {
    id: 4,
    day: 2,
    title: 'Variáveis e constantes',
    summary: 'Guardando valores que podem mudar — ou que ficam fixos.',
    explanation: `Uma variável é como uma caixinha com nome, usada para guardar um
valor e usá-lo depois. Em PHP, toda variável começa com o símbolo "$", seguido
do nome (sem espaços e sem começar com número). O valor pode mudar ao longo do
programa: o PHP considera sempre o mais recente.

Já uma constante guarda um valor fixo, que não muda. Ela é criada com
"define()", não usa "$" e, por convenção, tem o nome em maiúsculas. Atenção: o
PHP diferencia maiúsculas de minúsculas nos nomes — "$nome" e "$Nome" são
variáveis diferentes.`,
    code: `<?php

define("NOME_CURSO", "PHP"); // constante: valor fixo

$nome = "Ana";
$idade = 20;

// O ponto "." junta textos; <br> quebra a linha na página
echo "Curso: " . NOME_CURSO . "<br>";
echo "Aluna: " . $nome . "<br>";
echo "Idade: " . $idade . "<br>";

// O valor de uma variável pode ser alterado depois
$nome = "João";
echo "Novo nome: " . $nome . "<br>";
`,
    challenge: 'Crie uma variável $cidade com o nome da sua cidade e uma constante PAIS, e exiba as duas com echo.',
    video_url: 'https://drive.google.com/file/d/1_iZcLYCWpElpiIHli8wdXsr0K60fmxaW/view?usp=sharing',
  },
  {
    id: 5,
    day: 2,
    title: 'Tipos de dados',
    summary: 'string, int, float, bool e null.',
    explanation: `Nem toda informação representa a mesma coisa: todo valor em PHP tem
um tipo. Os principais tipos básicos são: "string" (texto, entre aspas), "int"
(número inteiro), "float" (número com casas decimais — o separador é o ponto,
não a vírgula), "bool" (verdadeiro ou falso: "true"/"false") e "null"
(ausência de valor). O PHP descobre o tipo sozinho, e você pode conferir com
"var_dump()", que mostra o tipo junto com o valor.`,
    code: `<?php

$nome     = "Maria";  // string
$idade    = 26;       // int
$altura   = 1.65;     // float
$ativo    = true;     // bool
$telefone = null;     // null (sem valor)

var_dump($nome);      // string(5) "Maria"
var_dump($idade);     // int(26)
var_dump($altura);    // float(1.65)
var_dump($ativo);     // bool(true)
var_dump($telefone);  // NULL
`,
    challenge: 'Crie uma variável $preco com um valor decimal e confira o tipo dela com var_dump().',
    video_url: 'https://drive.google.com/file/d/1I_FvrrFP2B67KYCJy_slhdkQqMrQ4ImE/view?usp=sharing',
  },
  {
    id: 6,
    day: 2,
    title: 'Operadores matemáticos e de atribuição',
    summary: 'Contas básicas e formas curtas de atualizar variáveis.',
    explanation: `PHP tem os operadores matemáticos básicos: "+" (soma), "-"
(subtração), "*" (multiplicação), "/" (divisão) e "%" (resto da divisão). Já os
operadores de atribuição guardam um valor numa variável — o mais comum é "=",
mas existem versões curtas que fazem uma conta e já atualizam a variável no
mesmo passo: "+=" soma e atribui, "-=" subtrai e atribui, "*=" multiplica e
atribui, "/=" divide e atribui. "$a += 5" é o mesmo que escrever
"$a = $a + 5", só que mais curto. E há os atalhos "++" e "--", que aumentam ou
diminuem a variável em uma unidade.`,
    code: `<?php

echo "Soma: " . (5 + 3) . PHP_EOL;          // 8
echo "Subtração: " . (5 - 3) . PHP_EOL;     // 2
echo "Multiplicação: " . (5 * 3) . PHP_EOL; // 15
echo "Divisão: " . (6 / 3) . PHP_EOL;       // 2
echo "Resto: " . (7 % 3) . PHP_EOL;         // 1

// Operadores de atribuição: fazem a conta e já guardam o resultado
$saldo = 100;
$saldo += 50; // o mesmo que $saldo = $saldo + 50;
echo "Depois do depósito: " . $saldo . PHP_EOL;

$saldo -= 30; // o mesmo que $saldo = $saldo - 30;
echo "Depois do saque: " . $saldo . PHP_EOL;

// Atalhos: ++ soma 1 e -- subtrai 1
$contador = 1;
$contador++;
echo "Contador: " . $contador . PHP_EOL; // 2
$contador--;
echo "Contador: " . $contador . PHP_EOL; // 1
`,
    challenge: 'Calcule a área de um retângulo de base 5 e altura 8 usando o operador *, depois use += para somar 10 ao resultado.',
    video_url: 'https://drive.google.com/file/d/1ubShLiSiaBMryvp_wWlTOpFRTcnJqmOB/view?usp=sharing',
  },

  // ---------------- DIA 3 ----------------
  {
    id: 7,
    day: 3,
    title: 'Operadores matemáticos e de atribuição (parte 2)',
    summary: 'Expressões e uma pequena calculadora com os operadores da aula anterior.',
    explanation: `Esta aula continua a anterior. Uma expressão combina valores e
operadores para chegar a um resultado: em "$resultado = $a + $b", as variáveis
guardam os valores, o operador define a conta e o PHP produz o resultado.

Com isso dá para montar uma pequena calculadora: guardar dois números em
variáveis e calcular soma, subtração, multiplicação e divisão. Vale atenção ao
operador "%": o resto da divisão é muito útil — por exemplo, um número é par
quando o resto da divisão dele por 2 é 0.`,
    code: `<?php

// Pequena calculadora
$a = 20;
$b = 5;

$soma = $a + $b;
$sub  = $a - $b;
$mult = $a * $b;
$div  = $a / $b;

echo "Soma: " . $soma . PHP_EOL;          // 25
echo "Subtração: " . $sub . PHP_EOL;      // 15
echo "Multiplicação: " . $mult . PHP_EOL; // 100
echo "Divisão: " . $div . PHP_EOL;        // 4

// O resto da divisão
$resto = 7 % 2;
echo "Resto de 7 por 2: " . $resto . PHP_EOL; // 1
`,
    challenge: 'Troque os valores de $a e $b na calculadora e confira os quatro resultados. Depois, use % para descobrir o resto de 10 dividido por 4.',
    video_url: 'https://drive.google.com/file/d/1l5srfNqkU_1M0mRhnSjfMaJu4t_vcxBX/view?usp=sharing',
  },
  {
    id: 8,
    day: 3,
    title: 'Operadores aritméticos na prática',
    summary: 'Contas do dia a dia, potência e a ordem das operações.',
    explanation: `Na programação, fazemos contas o tempo todo: o total de uma compra,
a divisão de uma conta, uma pontuação. Esta aula pratica os operadores
aritméticos em situações assim e apresenta mais um: "**" (potência) —
"2 ** 3" é 2 elevado a 3, que dá 8.

A ordem das contas muda o resultado. Como na matemática, multiplicação e
divisão são feitas antes de soma e subtração: "10 + 2 * 3" dá 16. Para mudar a
ordem, use parênteses: "(10 + 2) * 3" dá 36.`,
    code: `<?php

// Carrinho de compras simples
$preco = 25;
$quantidade = 3;
$desconto = 10;

$total = $preco * $quantidade - $desconto;
echo "Total do carrinho: " . $total . PHP_EOL; // 65

// Dividindo a conta
$conta = 90;
$pessoas = 3;
echo "Cada pessoa paga: " . ($conta / $pessoas) . PHP_EOL; // 30

// Potência
echo "2 elevado a 3: " . (2 ** 3) . PHP_EOL; // 8

// A ordem das contas muda o resultado
echo "Sem parênteses: " . (10 + 2 * 3) . PHP_EOL;   // 16
echo "Com parênteses: " . ((10 + 2) * 3) . PHP_EOL; // 36
`,
    challenge: 'Antes de rodar, tente prever o resultado de 20 - 4 * 3. Depois coloque parênteses para a subtração ser feita primeiro e compare.',
    video_url: 'https://drive.google.com/file/d/19n8xcrhWzaBp83ipBxhiI9LhDFNJrvh_/view?usp=sharing',
  },
  {
    id: 9,
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
    video_url: 'https://drive.google.com/file/d/1t-XOE5p3kpp_UpwCzTTjO1NWDhVCBTWL/view?usp=sharing',
  },
  {
    id: 10,
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
    video_url: 'https://drive.google.com/file/d/1vb4AktsXsshIkhX60U3HxDS31j1J-gBm/view?usp=sharing',
  },

  // ---------------- DIA 4 ----------------
  {
    id: 11,
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
    video_url: 'https://drive.google.com/file/d/1Oh8b381k6fYD8vBD2ZNgBn8VnPQ3V0km/view?usp=sharing',
  },
  {
    id: 12,
    day: 4,
    title: 'Estrutura switch',
    summary: 'Comparando um valor com várias opções.',
    explanation: `"switch" compara uma variável com vários valores possíveis, um por
"case". É útil quando há muitas opções para testar, evitando uma longa cadeia
de "elseif". Não esqueça do "break" ao final de cada case — sem ele, a execução
continua no case seguinte — e do "default" para o caso em que nada corresponde.
O switch também compara textos, como o status de um pedido ("enviado",
"entregue").`,
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
    video_url: 'https://drive.google.com/file/d/162BQJUQepc0wXpH-IlEHXYLWrYRNLT79/view?usp=sharing',
  },

  // ---------------- DIA 5 ----------------
  {
    id: 13,
    day: 5,
    title: 'Arrays',
    summary: 'Guardando várias informações em uma única variável.',
    explanation: `Um array é uma lista de valores guardados em uma única variável.
Cada item tem uma posição (índice), começando em 0. Você acessa um item usando
colchetes: "$lista[0]" pega o primeiro item.

Com os mesmos colchetes você troca um valor ("$lista[1] = ...") ou, deixando-os
vazios, adiciona um item ao final ("$lista[] = ..."). A função "count()" diz
quantos itens o array tem e "print_r()" mostra a estrutura inteira dele.`,
    code: `<?php

$frutas = ["Maçã", "Banana", "Uva"];

echo $frutas[0] . PHP_EOL; // Maçã (a contagem começa em 0)
echo $frutas[2] . PHP_EOL; // Uva

$frutas[1] = "Laranja"; // substitui o valor da posição 1
$frutas[] = "Manga";    // colchetes vazios: adiciona um item ao final

echo "Total de frutas: " . count($frutas) . PHP_EOL; // 4

print_r($frutas); // mostra a estrutura completa do array
`,
    challenge: 'Crie um array com 3 filmes favoritos e exiba o segundo item dele.',
    video_url: 'https://drive.google.com/file/d/1u5td9aoG8MTnmeAAN6SV5UuciCItWX5X/view?usp=sharing',
  },
  {
    id: 14,
    day: 5,
    title: 'Arrays associativos',
    summary: 'Arrays com chaves nomeadas em vez de números.',
    explanation: `Em um array associativo, cada valor tem uma chave com nome, em vez
de um número. Isso deixa o código mais legível quando os dados representam
propriedades de algo, como uma pessoa ou um produto.

Cada item é escrito como "chave => valor". Pelo nome da chave você consulta,
altera um valor ou adiciona uma informação nova, e "array_key_exists()" confere
se uma chave existe antes de usá-la. As chaves diferenciam maiúsculas de
minúsculas: "nome" e "Nome" são chaves diferentes.`,
    code: `<?php

$aluno = [
    "nome"  => "Ana",
    "idade" => 20,
    "curso" => "PHP",
];

echo $aluno["nome"] . " tem " . $aluno["idade"] . " anos." . PHP_EOL;

$aluno["idade"] = 21;        // altera um valor existente
$aluno["cidade"] = "Recife"; // chave nova: cria uma entrada no array

if (array_key_exists("cidade", $aluno)) {
    echo "Cidade: " . $aluno["cidade"] . PHP_EOL;
}
`,
    challenge: 'Crie um array associativo para um produto com "nome" e "preco", depois exiba os dois valores.',
    video_url: 'https://drive.google.com/file/d/1z0XzoAWwbPgN2BgLJ6CG7ArTWauH8mGD/view?usp=sharing',
  },

  // ---------------- DIA 6 ----------------
  {
    id: 15,
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
    video_url: 'https://drive.google.com/file/d/18_lDSe77ss2ud2W59yc3e8FG7TsBtcMC/view?usp=sharing',
  },
  {
    id: 16,
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
    video_url: 'https://drive.google.com/file/d/1M3LE0Q_Dy3lNr-bW1iN7TDXcvfM1hWd-/view?usp=sharing',
  },
  {
    id: 17,
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
    video_url: 'https://drive.google.com/file/d/1qltoDirL2zkN39fr8JPhXlP9awEP4i77/view?usp=sharing',
  },

  // ---------------- DIA 7 ----------------
  {
    id: 18,
    day: 7,
    title: 'Funções',
    summary: 'Organizando código reutilizável.',
    explanation: `Uma função agrupa um bloco de código que pode ser executado
(chamado) várias vezes, evitando repetição. Ela pode receber parâmetros de
entrada e devolver um valor com "return". Criar a função não executa nada: ela
só roda quando é chamada pelo nome, com parênteses.

"echo" e "return" fazem coisas diferentes: "echo" exibe um texto na tela, já
"return" encerra a função e devolve um valor para o programa — que pode ser
guardado numa variável ou usado em outra conta.`,
    code: `<?php

// Função sem parâmetro: só é executada quando é chamada
function boasVindas(): void {
    echo "Olá, pessoal!" . PHP_EOL;
}

boasVindas();

// Função com parâmetro: a mesma função, valores diferentes
function saudacao(string $nome): void {
    echo "Olá, " . $nome . "!" . PHP_EOL;
}

saudacao("Ana");
saudacao("Pedro");

// Função com return: devolve um valor em vez de exibir
function calcularMedia(float $nota1, float $nota2): float {
    return ($nota1 + $nota2) / 2;
}

$media = calcularMedia(8, 6);
echo "A média foi " . $media . PHP_EOL; // 7
`,
    challenge: 'Troque as notas passadas para calcularMedia() e veja a média mudar. Depois, crie uma função "quadrado($n)" que retorna o número elevado ao quadrado.',
    video_url: 'https://drive.google.com/file/d/1z51CGs8l32ygBlmOwCg3wSzfr5bI0Xb-/view?usp=sharing',
  },
  {
    id: 19,
    day: 7,
    title: 'Manipulação básica de strings',
    summary: 'Funções úteis para trabalhar com texto.',
    explanation: `Uma string é um texto: um nome, uma frase, um e-mail. Ela pode ser
escrita entre aspas simples ou duplas, e o PHP tem várias funções prontas para
trabalhar com ela: "strlen()" diz o tamanho do texto,
"strtoupper()"/"strtolower()" mudam a caixa das letras, "ucwords()" deixa
maiúscula a primeira letra de cada palavra, "trim()" remove espaços das pontas
e "str_replace()" troca um trecho por outro. Para juntar textos
(concatenação), use o operador ponto ".".

Um detalhe importante: "strlen()" conta bytes, não letras. Letras sem acento
ocupam 1 byte cada, mas letras acentuadas (como "é" e "ó") ocupam 2 — por isso
o exemplo abaixo usa textos sem acentos. Para textos com acento existem as
versões "mb_strlen()" e "mb_strtoupper()", que contam e convertem letra por
letra.

Outro cuidado: "strpos()" procura um trecho e devolve a posição dele, ou
"false" se não encontrar. Como a posição 0 (início do texto) é uma resposta
válida, compare sempre com "=== false" ou "!== false".`,
    code: `<?php

$nome = "  marina silva  ";

echo strlen($nome) . PHP_EOL;      // 16 (conta também os espaços das pontas)

$nome = trim($nome);               // remove os espaços das pontas
echo strlen($nome) . PHP_EOL;      // 12
echo ucwords($nome) . PHP_EOL;     // Marina Silva
echo strtoupper($nome) . PHP_EOL;  // MARINA SILVA
echo strtolower("PHP") . PHP_EOL;  // php

$frase = "Eu gosto de Java";
echo str_replace("Java", "PHP", $frase) . PHP_EOL; // Eu gosto de PHP

// Concatenação: o ponto junta textos
$curso = "PHP";
echo ucwords($nome) . " estuda " . $curso . PHP_EOL;

// "Eu" está na posição 0: por isso a comparação é com !== false
if (strpos($frase, "Eu") !== false) {
    echo "Encontrado" . PHP_EOL;
}
`,
    challenge: 'Guarde o seu nome completo numa variável, com espaços sobrando e tudo em minúsculas. Retire os espaços extras e exiba o nome formatado numa frase de boas-vindas.',
    video_url: 'https://drive.google.com/file/d/1TXXatsfFHW3uVaWVV1uqq4zqdk1j5t8v/view?usp=sharing',
  },

  // ---------------- DIA 8 ----------------
  {
    id: 20,
    day: 8,
    title: 'Trabalhando com datas',
    summary: 'Exibindo, formatando e calculando datas em PHP.',
    explanation: `A função "date()" formata a data e hora atuais do servidor
usando um formato definido por letras: "d" (dia), "m" (mês), "Y" (ano com 4
dígitos), "H:i:s" (hora:minuto:segundo). Maiúsculas e minúsculas importam:
cada letra representa uma informação diferente. Como o servidor pode estar
em outra região, defina o fuso horário com "date_default_timezone_set()" para
não exibir horários inesperados.

Para fazer contas com datas existe a classe "DateTime", que trata a data como
um objeto: "format()" exibe no formato que você quiser, "modify()" soma ou
subtrai tempo (como "+7 days") e "diff()" calcula o intervalo entre duas
datas. E antes de aceitar uma data digitada por alguém, confira se ela existe
com "checkdate()" — 31 de fevereiro, por exemplo, não existe.`,
    code: `<?php

// Fuso horário explícito: a hora não depende da configuração do servidor
date_default_timezone_set("America/Sao_Paulo");

echo date("d/m/Y") . PHP_EOL;        // ex: 13/11/2026
echo date("d/m/Y H:i:s") . PHP_EOL;  // data e hora

// DateTime: a biblioteca empresta um livro por 15 dias
$emprestimo = new DateTime("2026-11-13");
$devolucao  = new DateTime("2026-11-13");
$devolucao->modify("+15 days");

echo "Devolver até: " . $devolucao->format("d/m/Y") . PHP_EOL; // 28/11/2026

// diff() calcula o intervalo entre duas datas
$intervalo = $emprestimo->diff($devolucao);
echo "Prazo em dias: " . $intervalo->days . PHP_EOL; // 15

var_dump(checkdate(2, 31, 2026)); // bool(false): 31 de fevereiro não existe
`,
    challenge: 'Mostre a data atual no formato brasileiro e, usando DateTime e modify(), a data de daqui a 7 dias.',
    video_url: 'https://drive.google.com/file/d/1NKn46yG3Kch01Uf4VD77dBH2pUvNx-xO/view?usp=sharing',
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
