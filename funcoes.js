function adicionarCrime() {
    // Obter os valores do formulário
    var crime = document.getElementById("crime").value;
    var tempoPena = document.getElementById("crime").options[document.getElementById("crime").selectedIndex].getAttribute("data-tempoPena");
    var valorMulta = document.getElementById("crime").options[document.getElementById("crime").selectedIndex].getAttribute("data-valorMulta");
    var qntd = document.getElementById("qntd").value;
    var fianca = document.getElementById("crime").options[document.getElementById("crime").selectedIndex].getAttribute("data-fianca");
    var valorQntd = document.getElementById("crime").options[document.getElementById("crime").selectedIndex].getAttribute("data-valor");
    var qntdUnitaria =  document.getElementById("crime").options[document.getElementById("crime").selectedIndex].getAttribute("data-qntd");

    // Criar uma nova linha na tabela
    var tabela = document.getElementById("crimeTableBody");
    var novaLinha = tabela.insertRow();

    // Inserir células com os valores
    var celulaCrime = novaLinha.insertCell(0);
    celulaCrime.innerHTML = crime;

    var celulaQntd = novaLinha.insertCell(1);
    if (qntd != null) {
        celulaQntd.innerHTML = qntd;
    } else {
        celulaQntd.innerHTML = "";
    }

    var celulaQntdUnitaria = novaLinha.insertCell(2);
    if (qntdUnitaria != null){
        celulaQntdUnitaria.innerHTML = qntdUnitaria;
    } else {
        celulaQntdUnitaria.innerHTML = "";
    }

    var celulaValorQntd = novaLinha.insertCell(3);
    if (valorQntd != null){
        celulaValorQntd.innerHTML = valorQntd;
    } else {
        celulaValorQntd.innerHTML = "";
    }
    


    var celulaTempoPena = novaLinha.insertCell(4);
    celulaTempoPena.innerHTML = tempoPena;

    var celulaValorMulta = novaLinha.insertCell(5);
    if (valorMulta == null) {
        valorMulta = valorQntd * qntd;
        celulaValorMulta.innerHTML = valorMulta
    } else {
        celulaValorMulta.innerHTML = valorMulta;
    }


    var celulaFianca = novaLinha.insertCell(6);
    celulaFianca.innerHTML = fianca;


    var botaoExcluir = novaLinha.insertCell(7);
    botaoExcluir.innerHTML = document.createElement("button");
    botaoExcluir.innerHTML = "Excluir";
    botaoExcluir.className = "btn btn-danger btn-sm"; // Estilo Bootstrap para o botão de exclusão

    botaoExcluir.addEventListener("click", function () {
        var rowIndex = novaLinha.rowIndex;
        tabela.deleteRow(rowIndex - 1); // Exclua a linha correspondente
    });


}

// Adicionar um evento de clique ao botão "Adicionar" para chamar a função acima
var btnAdicionar = document.getElementById("addCrime");
btnAdicionar.addEventListener("click", function (e) {
    e.preventDefault(); // Evitar que o formulário seja enviado
    adicionarCrime();
});


// Função para somar o tempo total de prisão
function calcularTempoTotal() {
    var tabela = document.getElementById("crimeTableBody");
    var linhas = tabela.getElementsByTagName("tr");
    var tempoTotal = 0;
    var primario = document.getElementById("primario");
    var adv = document.getElementById("display").value;

    for (var i = 0; i < linhas.length; i++) {
        var celulaTempoPena = linhas[i].getElementsByTagName("td")[4];
        if (celulaTempoPena) {
            tempoTotal += parseInt(celulaTempoPena.innerHTML);
        }
    }

    if (primario.checked) {
        tempoTotal = tempoTotal - (tempoTotal * 0.5);
    }

    if (adv != 0) {
        tempoTotal = tempoTotal * (adv / 100);
    }

    return tempoTotal;
}

function calcularMultaTotal() {
    var tabela = document.getElementById("crimeTableBody");
    var linhas = tabela.getElementsByTagName("tr");
    var seentregar = document.getElementById("entregar");
    var colaborar = document.getElementById("colaborar");
    var primario = document.getElementById("primario");
    var cumplice = document.getElementById("cumplice");
    var adv = document.getElementById("display").value;
    var multaTotal = 0;

    for (var i = 0; i < linhas.length; i++) {
        var celulaMulta = linhas[i].getElementsByTagName("td")[5];
        if (celulaMulta) {
            multaTotal += parseInt(celulaMulta.innerHTML);
        }
    }

    if (adv.value != 0) {
        multaTotal = multaTotal - (multaTotal * adv / 100);
    }

    if (seentregar.checked) {
        multaTotal = multaTotal - (multaTotal * 0.3);
    }

    if (colaborar.checked) {
        multaTotal = multaTotal - (multaTotal * 0.25);
    }

    if (primario.checked) {
        multaTotal = multaTotal - (multaTotal * 0.5);
    }

    if (cumplice.checked) {
        multaTotal = multaTotal - (multaTotal * 0.3);

    }

    return multaTotal;

}

// Função para tratar o botão "Finalizar"
function finalizarCalculo() {
    var nome = document.getElementById("name").value; // Obter o nome
    var passaporte = document.getElementById("passport").value; // Obter o passaporte
    var validadorNome = validador(nome);
    var validadorPassaporte = validador(passaporte);
    var crimesCometidos = [];



    if (validadorNome && validadorPassaporte) {
        var tempoTotal = calcularTempoTotal();
        var multaTotal = calcularMultaTotal();
        var tabela = document.getElementById("crimeTableBody");
        var linhas = tabela.getElementsByTagName("tr");
        var fianca = 0, flag;
        var desacato = document.getElementById("desacato");

        for (var i = 0; i < linhas.length; i++) {
            var celulaCrime = linhas[i].getElementsByTagName("td")[0];
            if (celulaCrime) {
                var crime = celulaCrime.innerHTML;
                crimesCometidos.push(crime);
            }
        }

        for (var i = 0; i < linhas.length; i++) {
            var celulaFianca = linhas[i].getElementsByTagName("td")[6];
            var conteudoColuna = celulaFianca.innerHTML;
            var valorNumerico = parseFloat(conteudoColuna);
            if (celulaFianca) {
                console.log(valorNumerico);
                if (valorNumerico == 0){
                    flag = 1;
                    break;
                }
                else {
                    if (i == 0){
                        fianca = valorNumerico;
                    } else {
                        fianca = fianca + valorNumerico;  
                    }

                  }
            } 
        }

        if (flag == 1){
            fianca = "Você não possui fiança";
        } else {
            fianca= multaTotal+fianca;
        }


        if (desacato.checked) {
            fianca = "Você não possui fiança";
        }

        var mensagem = "Nome: " + nome + "\nPassaporte: " + passaporte + "\nCrimes Cometidos:\n";

        for (var j = 0; j < crimesCometidos.length; j++) {
            mensagem += "- " + crimesCometidos[j] + "\n";
        }

        

        mensagem += "Tempo Total de Serviço: \n" + tempoTotal;

        mensagem += "\nMulta total: \n" + multaTotal;

        mensagem += "\nFiança total: \n" + fianca;

        // Copie a mensagem para a área de transferência
        var textarea = document.createElement("textarea");
        textarea.value = mensagem;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        alert("Os dados foram copiados para a área de transferência.");
    } else {
        alert("Preencha os campos de nome e passaporte!");
    }

}

function validador(variavel) {
    variavel.trim();
    if (variavel != "") {
        return true;
    } else {
        return false;
    }
}

// Adicionar um evento de clique ao botão "Finalizar" para chamar a função finalizarCalculo
var btnFinalizar = document.getElementById("finalizar");
btnFinalizar.addEventListener("click", function (e) {
    e.preventDefault(); // Evitar que o formulário seja enviado
    finalizarCalculo();
});

// Função para ordenar os itens do combobox em ordem alfabética
function ordenarCombobox() {
    var combobox = document.getElementById("crime");
    var options = Array.from(combobox.options);

    options.sort(function (a, b) {
        var textA = a.text.toUpperCase();
        var textB = b.text.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    // Limpe o combobox
    combobox.innerHTML = "";

    // Adicione as opções ordenadas de volta ao combobox
    options.forEach(function (option) {
        combobox.appendChild(option);
    });
}

// Chame a função para ordenar o combobox apenas uma vez durante o carregamento da página
ordenarCombobox();