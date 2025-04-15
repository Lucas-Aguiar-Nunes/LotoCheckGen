// Função Conecta com Loterias Caixa API
async function request(id) {
    let url = "https://loteriascaixa-api.herokuapp.com/api/lotofacil"   // Endpoint para Todos os Concurso

    if (id == "latest"){
        url = url +"/latest";                                           // Endpoint para Último Concurso
    }
    else if (id == "concursos"){
        let concurso = document.getElementById("input").value;
        url = url + "/" + concurso;                                     // Endpoint para Concurso Informado pelo Usuário
    }

    // Conexão com API
    try{
        let response = await fetch(url);
        if (!response.ok){
            throw new Error("Erro!\nStatus "+response.status+" - "+response.statusText);
        }   
        let resultado = await response.json();  // Se Conexão for OK, Converte JSON para Objeto JavaScript
        return resultado;                       // Retorna Objeto
    }
    catch (error){
        console.log(error)                   //Erro na Requisição HTTP
        return;
    }
}


// Função para Verificar se Acertou último Concurso
async function check_loto(id) {
    if (jogo.length != 15){
        console.log("Numeros Insuficentes!");
        return;
    }
    
    let concurso = await request(id);
    let verificacao = compara_jogos(jogo, concurso.dezenas);

    if (verificacao == 15){
        console.log("Ganhou!");
    }
    else{
        console.log("Perdeu\n Acertou "+verificacao+" Numeros!");
    }
}

// Função para Verificar se Jogo já Saiu em Algum Concurso
async function historico_loto(id) {
    if (jogo.length != 15){
        console.log("Numeros Insuficentes!");
        return;
    }
    let historico = await request(id);

    for (let index = 0; index < historico.length; index++){                 // Verificar cada Jogo de Todos os Concursos já Realizados
        let verificacao = compara_jogos(jogo, historico[index].dezenas);
        if (verificacao == 15){
            console.log("Já Saiu");
            console.log("Concurso: "+historico[index].concurso);
            return;
        }
    }
        console.log("Nunca Saiu");
}

// Função para Gerar Jogo Aleatório que ainda não saiu
async function gen_loto(){
    let lotofacil = ['01','02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
    //let jogo = ['01', '05'];   // Fixos Informados pelo Usuário
    for (let indice = 0; indice < jogo.length; indice++){
        let remover = lotofacil.indexOf(jogo[indice]);      // Encontra Posição de Numero Já Informado
        lotofacil.splice(remover, 1)                        // Remover Numeros Já Informados
    }
    while (jogo.length < 15) {
        let indice = Math.trunc(Math.random() * lotofacil.length);  // Gera um número inteiro aleatório para indice Array
        // Gera entre 0 e 1, multiplica pelo tamanho do array lotofacil e desconsidera parte decimal
        let sorteado = lotofacil.splice(indice, 1)[0]; // splice - Remover do Array (para não repetir)
        // E adiciona em sorteado (como array - indice 0)
        jogo.push(sorteado);
    }
    jogo.sort((a, b) => Number(a) - Number(b));      // Ordenar Jogo
    historico_loto("verifica");
    return;
}

// Função para Comparar 2 Jogos (Em Arrays)
function compara_jogos(usuario, loterica){
    let contador = 0;
    for (let indice = 0; indice < 15; indice++){
        if (usuario.includes(loterica[indice])){        // Se Dezena Sorteada que está no Array está no Array do Usuário
            contador ++;
        }
    }
    return contador;
}

function limpar_selecao(){
    let botoes = document.querySelectorAll(".numeros"); // Seleciona Todos os Elementos da Classe Numeros
    botoes.forEach(botao => {
        botao.style.background = 'radial-gradient(50% 50% at 50% 50%, rgba(181, 70, 195, 0.5) 50%, #B546C3)';
    })
    jogo.splice(0, jogo.length);
}

let jogo = [];
let botoes = document.querySelectorAll(".numeros"); // Seleciona Todos os Elementos da Classe Numeros
// Loop para cada Botão executar função passada
botoes.forEach(botao => {
  botao.addEventListener("click", function () {
    let numero = this.textContent;  // Pega o texto dentro do botão
    if (!jogo.includes(numero)){    // Se Numero Não Está Selecionado
        if (jogo.length < 15){      // Se já não foram os 15 numeros do jogo 
            jogo.push(numero);
            document.getElementById(numero).style.background = 'radial-gradient(50% 50% at 50% 50%, rgba(181, 70, 195, 0.5) 50%, white)';
        }
        else{
            alert("15 Numeros já adicionados!");
        }
    }
    else{
        let remover = jogo.indexOf(numero);             // Encontra Posição de Numero Selecionado
        jogo.splice(remover, 1)                         // Remover Numero Selecionado
        document.getElementById(numero).style.background = 'radial-gradient(50% 50% at 50% 50%, rgba(181, 70, 195, 0.5) 50%, #B546C3)';
    }
  })
})