// Função para Verificar se Acertou último Concurso
async function latest_loto() {
    let jogo = ['01', '02', '03', '04', '06', '10', '11', '13', '14', '15', '16', '21', '22', '23', '24'];  // Jogo Informado pelo Usuário
    let response = await fetch("https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest");             // Conectar com Loterias API REST

    if (response.ok){
        let resultado = await response.json();  // Se Conexão for OK, Converte JSON para Objeto JavaScript
        let verificacao = compara_jogos(jogo, resultado.dezenas);
        if (verificacao == 15){
            console.log("Ganhou!");
        }
        else{
            console.log("Perdeu\n Acertou "+verificacao+" Numeros!");
        }
    }
    else{
        console.log("Erro");        //Erro na Requisição HTTP
    }
}

// Função para Verificar se Jogo já Saiu em Algum Concurso
async function check_loto(jogo) {
    let response = await fetch("https://loteriascaixa-api.herokuapp.com/api/lotofacil");                    // Conectar com Loterias API REST
    //let jogo = ['02', '03', '05', '06', '09', '10', '11', '13', '14', '16', '18', '20', '23', '24', '25'];  // Jogo Informado pelo Usuário
    if (response.ok){
        let resultado = await response.json();
        for (let index = 0; index < resultado.length; index++){                 // Verificar cada Jogo de Todos os Concursos já Realizados
            let verificacao = compara_jogos(jogo, resultado[index].dezenas);
            if (verificacao == 15){
                console.log("Já Saiu");
                console.log(resultado[index].concurso);
                return;
            }
        }
        console.log("Nunca Saiu");
    }
    else{
        console.log("Erro");    //Erro na Requisição HTTP
    }
}

// Função para Gerar Jogo Aleatório que ainda não saiu
function gen_loto(){
    let lotofacil = ['01','02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
    let jogo = ['01', '05'];   // Fixos Informados pelo Usuário
    for (let indice = 0; indice < jogo.length; indice++){
        let remover = lotofacil.indexOf(jogo[indice]);      //Encontra Posição de Numero Já Informado
        lotofacil.splice(remover, 1)                        //Remover Numeros Já Informados
    }
    while (jogo.length < 15) {
        let indice = Math.trunc(Math.random() * lotofacil.length);  // Gera um número inteiro aleatório para indice Array
        // Gera entre 0 e 1, multiplica pelo tamanho do array lotofacil e desconsidera parte decimal
        let sorteado = lotofacil.splice(indice, 1)[0]; // splice - Remover do Array (para não repetir)
        // E adiciona em sorteado (como array - indice 0)
        jogo.push(sorteado);
    }
    jogo.sort((a, b) => Number(a) - Number(b));      // Ordenar Jogo
    check_loto(jogo);
    return
}

// Função para Comparar 2 Jogos (Em Arrays)
function compara_jogos(usuario, loterica){
    let contador = 0;
    for (let indice = 0; indice < 15; indice++){
        if (usuario[indice] == loterica[indice]){
            contador ++;
        }
    }
    return contador;
}