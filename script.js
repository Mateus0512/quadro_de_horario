var data = document.getElementById('data');
var linhas = document.getElementById('linhas');
var linha = document.getElementById('linha');
var consultar = document.getElementById('consultar');
var dados_linha = document.getElementById('dados_linha');
var div_tabela = document.getElementById('div_tabela');
var quadro_content = document.getElementById('quadro_content');
var gerar_pdf = document.getElementById('gerar_pdf');
var gerar_planilha = document.getElementById('gerar_planilha');

var primeiro_posto = [];
var segundo_posto = [];
var terceiro_posto = [];
var quarto_posto = [];

var nome_primeiro_posto = '';
var nome_segundo_posto = '';
var nome_terceiro_posto = '';
var nome_quarto_posto = '';

tipo_linha = '';


dia_atual = () =>{
    let date = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    
    data_atual = date.split('/');
    ano = data_atual[2].split(',');
    data.value = ano[0]+'-'+data_atual[1]+'-'+data_atual[0];

}
dia_atual();

async function listar_linhas(){
    let url  = 'http://gistapis.etufor.ce.gov.br:8081/api/linhas/';
    let response = await fetch(url);
    let lista_linhas = await response.json();
    for(let i=0;i<lista_linhas.length;i++){
        linhas.innerHTML += `
        <option>`+lista_linhas[i].numeroNome+`</option>
        `;
    }
} 
listar_linhas();

async function buscar_programacao(){
    limpar_tabela();
    let url = 'http://gistapis.etufor.ce.gov.br:8081/api/Programacao/';
    let numero_linha = linha.value;
    
    numero_linha = numero_linha.split('-');
    let response = await fetch(url+numero_linha[0]+'?data='+data.value.split('-').join(''));
    let programacao = await response.json();
    console.log(programacao);

    if(programacao.Message){
        alert('Programação não encontrada');
    }

    tipo_linha = programacao.linha.indexOf('Corujão');
    


//Escrever os dados das linhas 
    let data_vigencia = programacao.dataInicioVigencia;
    data_vigencia = data_vigencia.slice(0,data_vigencia.indexOf('T'));
    data_vigencia = data_vigencia.split('-');
    let empresas = [];


    dados_linha.innerHTML = `
    <div class="row">
        <div class="col">
        <span><strong id="codigo_linha">Linha: `+programacao.linha+`</strong></span>
        </div>
        <div class="col">
        <span><strong id="numero_tabelas">Tabelas: `+programacao.quadro.tabelas.length+`</strong></span>
        </div>
        <div class="col">
            <span><strong id="numero_empresas">Empresa(s): `+"completar depois"+`</strong></span>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <span><strong id="vigencia">Vigência: `+data_vigencia[2]+'/'+data_vigencia[1]+'/'+data_vigencia[0]+`</strong></span>
        </div>
        <div class="col">
            <span><strong id="tipo_dia">Tipo do Dia: `+programacao.quadro.tipoDia+`</strong></span>
        </div>
        <div class="col">
            <span><strong id="classe_veiculo">Classe: `+programacao.quadro.tabelas[0].classe+`</strong></span>
        </div>
    </div>
    <hr>
    `;

    nome_primeiro_posto = programacao.quadro.tabelas[0].trechos[0].inicio.postoControle;
    nome_segundo_posto = programacao.quadro.tabelas[0].trechos[0].fim.postoControle;
    try {
        nome_terceiro_posto = programacao.quadro.tabelas[0].trechos[1].fim.postoControle;
        nome_quarto_posto = programacao.quadro.tabelas[0].trechos[2].fim.postoControle;
    } catch (error) {
        console.error(error);
    }


    for(let tabela=0;tabela<programacao.quadro.tabelas.length;tabela++){
        for(let trecho=0;trecho<programacao.quadro.tabelas[tabela].trechos.length;trecho++){
            if(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle==nome_primeiro_posto){
                primeiro_posto[primeiro_posto.length] = {
                 terminalSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle,
                 terminalChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.postoControle,
                 tabela:programacao.quadro.tabelas[tabela].numero,
                 descricaoSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.descricao.slice(0,1),
                 descricaoChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.descricao.slice(0,1),
                 saida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.length),
                 chegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.length)
                 }//json
                 empresas.push(programacao.quadro.tabelas[tabela].trechos[trecho].empresa);
            }//if

            else if(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle==nome_segundo_posto){
                segundo_posto[segundo_posto.length] = {
                terminalSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle,
                 terminalChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.postoControle,
                 tabela:programacao.quadro.tabelas[tabela].numero,
                 descricaoSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.descricao.slice(0,1),
                 descricaoChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.descricao.slice(0,1),
                 saida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.length),
                 chegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.length)
                }//json
                empresas.push(programacao.quadro.tabelas[tabela].trechos[trecho].empresa);
            }//if
            else if(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle==nome_terceiro_posto){
                terceiro_posto[terceiro_posto.length] = {
                    terminalSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle,
                    terminalChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.postoControle, 
                    tabela:programacao.quadro.tabelas[tabela].numero,
                    descricaoSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.descricao.slice(0,1),
                    descricaoChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.descricao.slice(0,1),
                    saida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.length),
                    chegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.length)
                }//json
                empresas.push(programacao.quadro.tabelas[tabela].trechos[trecho].empresa);
            }//if
            else if(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle==nome_quarto_posto){
                quarto_posto[quarto_posto.length] = {
                    terminalSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.postoControle,
                    terminalChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.postoControle,
                    tabela:programacao.quadro.tabelas[tabela].numero,
                    descricaoSaida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.descricao.slice(0,1),
                    descricaoChegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.descricao.slice(0,1),
                    saida: programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].inicio.horario.length),
                    chegada: programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.slice(programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.indexOf('T')+1,programacao.quadro.tabelas[tabela].trechos[trecho].fim.horario.length)
                }//json
                empresas.push(programacao.quadro.tabelas[tabela].trechos[trecho].empresa);
            }//if

        }//for trecho
    }//for tabela

    empresas = [... new Set(empresas)];
    empresas = empresas.sort((a,b)=>{
        if(a < b){
            return -1;
        }
        else if(a > b){
            return 1;
        }
        else if(a == b){
            return 0;
        }
    })

    document.getElementById('numero_empresas').textContent = 'Empresa(s): '+empresas;



    organizar_horario();
    
}

consultar.onclick = () =>{
    buscar_programacao();
}

organizar_horario = () =>{
    primeiro_posto = primeiro_posto.sort((a,b)=>{
        if(tipo_linha==-1){
            
            if(a.saida>'00:00'&&a.saida<'04:00'){
                return 1;
            }

            if(a.saida < b.saida){
                return -1;
            }
            else if(a.saida > b.saida){
                return 1;
            }
            else if(a.saida == b.saida){
                return 0;
            }
        }
        else{
            if(a.saida < b.saida){
                return -1;
            }
            else if(a.saida > b.saida){
                return 1;
            }
            else if(a.saida == b.saida){
                return 0;
            }
        }
    })

    segundo_posto = segundo_posto.sort((a,b)=>{
        if(tipo_linha==-1){
            if(a.saida>'00:00'&&a.saida<'04:00'){
                return 1;
            }

            if(a.saida < b.saida){
                return -1;
            }
            else if(a.saida > b.saida){
                return 1;
            }
            else if(a.saida == b.saida){
                return 0;
            }
        }
        else{
            if(a.saida < b.saida){
                return -1;
            }
            else if(a.saida > b.saida){
                return 1;
            }
            else if(a.saida == b.saida){
                return 0;
            }
        }
    })

    if(terceiro_posto.length != 0){
            terceiro_posto = terceiro_posto.sort((a,b)=>{
            if(tipo_linha==-1){
                if(a.saida>'00:00'&&a.saida<'04:00'){
                    return 1;
                }

                if(a.saida < b.saida){
                    return -1;
                }
                else if(a.saida > b.saida){
                    return 1;
                }
                else if(a.saida == b.saida){
                    return 0;
                }
            }
            else{
                if(a.saida < b.saida){
                    return -1;
                }
                else if(a.saida > b.saida){
                    return 1;
                }
                else if(a.saida == b.saida){
                    return 0;
                }
            }
        })
    }

    if(quarto_posto.length != 0){
        quarto_posto = quarto_posto.sort((a,b)=>{
            if(tipo_linha==-1){
                if(a.saida>'00:00'&&a.saida<'04:00'){
                    return 1;
                }

                if(a.saida < b.saida){
                    return -1;
                }
                else if(a.saida > b.saida){
                    return 1;
                }
                else if(a.saida == b.saida){
                    return 0;
                }
            }
            else{
                if(a.saida < b.saida){
                    return -1;
                }
                else if(a.saida > b.saida){
                    return 1;
                }
                else if(a.saida == b.saida){
                    return 0;
                }
            }
        })
    }


    

    escrever_tabela();
}


escrever_tabela = () =>{
    

    if(terceiro_posto.length===0 && quarto_posto.length===0){
        let tabela = document.createElement('table');
        tabela.classList.add('table');
        tabela.classList.add('table-striped');
        tabela.setAttribute('id','tabela');
        div_tabela.appendChild(tabela);
        let th = tabela.insertRow();

        let cabecalho1 = th.insertCell();
        let cabecalho2 = th.insertCell();
        let cabecalho3 = th.insertCell();
        let cabecalho4 = th.insertCell();
        let cabecalho5 = th.insertCell();
        let cabecalho6 = th.insertCell();
        let cabecalho7 = th.insertCell();
        let cabecalho8 = th.insertCell();

        cabecalho1.innerText = 'Tabela';
        cabecalho2.innerText = nome_primeiro_posto;
        cabecalho3.innerText = nome_segundo_posto;
        cabecalho4.innerText =  'Descrição';
        cabecalho5.innerText = 'Tabela';
        cabecalho6.innerText = nome_segundo_posto;
        cabecalho7.innerText = nome_primeiro_posto;
        cabecalho8.innerText = 'Descrição';

        th.classList.add('sticky-header');

        let tamanho = [];
        tamanho.push(primeiro_posto.length);
        tamanho.push(segundo_posto.length);

        let max = Math.max(...tamanho);

        for(let linha_tabela=0;linha_tabela<max;linha_tabela++){
            let tr = tabela.insertRow();

            let tabelaHorario = tr.insertCell();
            let horario1 = tr.insertCell();
            let horario2 = tr.insertCell();
            let descricaoInfo = tr.insertCell();

            let tabelaHorario2 = tr.insertCell();
            let horario3 = tr.insertCell();
            let horario4 = tr.insertCell();
            let descricaoInfo2 = tr.insertCell();

            try{

                tabelaHorario.innerText = primeiro_posto[linha_tabela].tabela+'  '+primeiro_posto[linha_tabela].descricaoSaida;
                horario1.innerText = primeiro_posto[linha_tabela].saida;
                horario2.innerText = primeiro_posto[linha_tabela].chegada;
                descricaoInfo.innerText = primeiro_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }
            
            try{

                tabelaHorario2.innerText = segundo_posto[linha_tabela].tabela+'  '+segundo_posto[linha_tabela].descricaoSaida;
                horario3.innerText = segundo_posto[linha_tabela].saida;
                horario4.innerText = segundo_posto[linha_tabela].chegada;
                descricaoInfo2.innerText = segundo_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }


        }



    }

    else if(terceiro_posto!=''&&quarto_posto==''){
        for(i=0;i < segundo_posto.length;i++){
            if(segundo_posto[i].terminalChegada==nome_terceiro_posto){
                quarto_posto[quarto_posto.length] = {
                    terminalSaida: segundo_posto[i].terminalSaida,
                    terminalChegada: segundo_posto[i].terminalChegada,
                    tabela: segundo_posto[i].tabela,
                    descricaoSaida: segundo_posto[i].descricaoSaida,
                    descricaoChegada: segundo_posto[i].descricaoChegada,
                    saida: segundo_posto[i].saida,
                    chegada: segundo_posto[i].chegada
                }
                segundo_posto.splice(i,1);
                i=0;
            } 
        }


        primeiro_posto =  primeiro_posto.sort((a,b)=>{
            
        if(a.saida>='00:00:00' && a.saida<'04:00:00'){
            
            return 1;
        }
  
        else if(a.saida < b.saida){
            return -1;
        }
        else if(a.saida > b.saida){
            return 1;
        }
        else if(a.saida === b.saida){
            return 0;
        }
    });

    
    segundo_posto = segundo_posto.sort((a,b)=>{
        
        if(a.saida>='00:00:00' && a.saida<'04:00:00'){
            
            return 1;
        }
        else if(a.saida < b.saida){
            return -1;
        }
        else if(a.saida > b.saida){
            return 1;
        }
        else if(a.saida === b.saida){
            return 0;
        }
    });

    terceiro_posto = terceiro_posto.sort((a,b)=>{
        if(a.saida>='00:00:00' && a.saida<'04:00:00'){
            
            return 1;
        }
        else if(a.saida < b.saida){
            return -1;
        }
        else if(a.saida > b.saida){
            return 1;
        }
        else if(a.saida === b.saida){
            return 0;
        }
    });

    quarto_posto = quarto_posto.sort((a,b)=>{
        
        if(a.saida>='00:00:00' && a.saida<'04:00:00'){
            console.log('condição');
            return 1;
        }
        else if(a.saida < b.saida){
            return -1;
        }
        else if(a.saida > b.saida){
            return 1;
        }
        else if(a.saida === b.saida){
            return 0;
        }
    });

        let tabela = document.createElement('table');
        tabela.classList.add('table');
        tabela.classList.add('table-striped');
        tabela.setAttribute('id','tabela');
        div_tabela.appendChild(tabela);
        let th = tabela.insertRow();

        let cabecalho1 = th.insertCell();
        let cabecalho2 = th.insertCell();
        let cabecalho3 = th.insertCell();
        let cabecalho4 = th.insertCell();
        let cabecalho5 = th.insertCell();
        let cabecalho6 = th.insertCell();
        let cabecalho7 = th.insertCell();
        let cabecalho8 = th.insertCell();
        let cabecalho9 = th.insertCell();
        let cabecalho10 = th.insertCell();
        let cabecalho11 = th.insertCell();
        let cabecalho12 = th.insertCell();
        let cabecalho13 = th.insertCell();
        let cabecalho14 = th.insertCell();
        let cabecalho15 = th.insertCell();
        let cabecalho16 = th.insertCell();

        cabecalho1.innerText = 'Tabela';
        cabecalho2.innerText = nome_primeiro_posto;
        cabecalho3.innerText = nome_segundo_posto;
        cabecalho4.innerText =  'Descrição';
        cabecalho5.innerText = 'Tabela';
        cabecalho6.innerText = nome_segundo_posto;
        cabecalho7.innerText = nome_terceiro_posto;
        cabecalho8.innerText = 'Descrição';
        cabecalho9.innerText = 'Tabela';
        cabecalho10.innerText = nome_terceiro_posto;
        cabecalho11.innerText = nome_segundo_posto;
        cabecalho12.innerText = 'Descrição';
        cabecalho13.innerText = 'Tabela';
        cabecalho14.innerText = nome_segundo_posto;
        cabecalho15.innerText = nome_primeiro_posto;
        cabecalho16.innerText = 'Descrição';

        let tamanho = [];
        tamanho.push(primeiro_posto.length);
        tamanho.push(segundo_posto.length);
        tamanho.push(terceiro_posto.length);
        tamanho.push(quarto_posto.length);

        let max = Math.max(...tamanho);

        for(let linha_tabela=0;linha_tabela<max;linha_tabela++){
            let tr = tabela.insertRow();

            let tabelaHorario = tr.insertCell();
            let horario1 = tr.insertCell();
            let horario2 = tr.insertCell();
            let descricaoInfo = tr.insertCell();

            let tabelaHorario2 = tr.insertCell();
            let horario3 = tr.insertCell();
            let horario4 = tr.insertCell();
            let descricaoInfo2 = tr.insertCell();

            let tabelaHorario3 = tr.insertCell();
            let horario5 = tr.insertCell();
            let horario6 = tr.insertCell();
            let descricaoInfo3 = tr.insertCell();

            let tabelaHorario4 = tr.insertCell();
            let horario7 = tr.insertCell();
            let horario8 = tr.insertCell();
            let descricaoInfo4 = tr.insertCell();

            try{

                tabelaHorario.innerText = primeiro_posto[linha_tabela].tabela+'  '+primeiro_posto[linha_tabela].descricaoSaida;
                horario1.innerText = primeiro_posto[linha_tabela].saida;
                horario2.innerText = primeiro_posto[linha_tabela].chegada;
                descricaoInfo.innerText = primeiro_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }
            
            try{

                tabelaHorario2.innerText = quarto_posto[linha_tabela].tabela+'  '+quarto_posto[linha_tabela].descricaoSaida;
                horario3.innerText = quarto_posto[linha_tabela].saida;
                horario4.innerText = quarto_posto[linha_tabela].chegada;
                descricaoInfo2.innerText = quarto_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }

            try{

                tabelaHorario3.innerText = terceiro_posto[linha_tabela].tabela+'  '+terceiro_posto[linha_tabela].descricaoSaida;
                horario5.innerText = terceiro_posto[linha_tabela].saida;
                horario6.innerText = terceiro_posto[linha_tabela].chegada;
                descricaoInfo3.innerText = terceiro_posto[linha_tabela].descricaoChegada;
                }
            catch(error){
                console.log(error);
            }

            try{

                tabelaHorario4.innerText = segundo_posto[linha_tabela].tabela+'  '+segundo_posto[linha_tabela].descricaoSaida;
                horario7.innerText = segundo_posto[linha_tabela].saida;
                horario8.innerText = segundo_posto[linha_tabela].chegada;
                descricaoInfo4.innerText = segundo_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }


        }

    }
    else if(terceiro_posto!=''&&quarto_posto!=''){
        let tabela = document.createElement('table');
        tabela.classList.add('table');
        tabela.classList.add('table-striped');
        tabela.setAttribute('id','tabela');
        div_tabela.appendChild(tabela);
        let th = tabela.insertRow();

        let cabecalho1 = th.insertCell();
        let cabecalho2 = th.insertCell();
        let cabecalho3 = th.insertCell();
        let cabecalho4 = th.insertCell();
        let cabecalho5 = th.insertCell();
        let cabecalho6 = th.insertCell();
        let cabecalho7 = th.insertCell();
        let cabecalho8 = th.insertCell();
        let cabecalho9 = th.insertCell();
        let cabecalho10 = th.insertCell();
        let cabecalho11 = th.insertCell();
        let cabecalho12 = th.insertCell();
        let cabecalho13 = th.insertCell();
        let cabecalho14 = th.insertCell();
        let cabecalho15 = th.insertCell();
        let cabecalho16 = th.insertCell();

        cabecalho1.innerText = 'Tabela';
        cabecalho2.innerText = nome_primeiro_posto;
        cabecalho3.innerText = nome_segundo_posto;
        cabecalho4.innerText =  'Descrição';
        cabecalho5.innerText = 'Tabela';
        cabecalho6.innerText = nome_segundo_posto;
        cabecalho7.innerText = nome_terceiro_posto;
        cabecalho8.innerText = 'Descrição';
        cabecalho9.innerText = 'Tabela';
        cabecalho10.innerText = nome_terceiro_posto;
        cabecalho11.innerText = nome_quarto_posto;
        cabecalho12.innerText = 'Descrição';
        cabecalho13.innerText = 'Tabela';
        cabecalho14.innerText = nome_quarto_posto;
        cabecalho15.innerText = nome_primeiro_posto;
        cabecalho16.innerText = 'Descrição';

        let tamanho = [];
        tamanho.push(primeiro_posto.length);
        tamanho.push(segundo_posto.length);
        tamanho.push(terceiro_posto.length);
        tamanho.push(quarto_posto.length);

        let max = Math.max(...tamanho);

        for(let linha_tabela=0;linha_tabela<max;linha_tabela++){
            let tr = tabela.insertRow();

            let tabelaHorario = tr.insertCell();
            let horario1 = tr.insertCell();
            let horario2 = tr.insertCell();
            let descricaoInfo = tr.insertCell();

            let tabelaHorario2 = tr.insertCell();
            let horario3 = tr.insertCell();
            let horario4 = tr.insertCell();
            let descricaoInfo2 = tr.insertCell();

            let tabelaHorario3 = tr.insertCell();
            let horario5 = tr.insertCell();
            let horario6 = tr.insertCell();
            let descricaoInfo3 = tr.insertCell();

            let tabelaHorario4 = tr.insertCell();
            let horario7 = tr.insertCell();
            let horario8 = tr.insertCell();
            let descricaoInfo4 = tr.insertCell();

            try{

                tabelaHorario.innerText = primeiro_posto[linha_tabela].tabela+'  '+primeiro_posto[linha_tabela].descricaoSaida;
                horario1.innerText = primeiro_posto[linha_tabela].saida;
                horario2.innerText = primeiro_posto[linha_tabela].chegada;
                descricaoInfo.innerText = primeiro_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }
            
            try{

                tabelaHorario2.innerText = segundo_posto[linha_tabela].tabela+'  '+segundo_posto[linha_tabela].descricaoSaida;
                horario3.innerText = segundo_posto[linha_tabela].saida;
                horario4.innerText = segundo_posto[linha_tabela].chegada;
                descricaoInfo2.innerText = segundo_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }

            try{

                tabelaHorario3.innerText = terceiro_posto[linha_tabela].tabela+'  '+terceiro_posto[linha_tabela].descricaoSaida;
                horario5.innerText = terceiro_posto[linha_tabela].saida;
                horario6.innerText = terceiro_posto[linha_tabela].chegada;
                descricaoInfo3.innerText = terceiro_posto[linha_tabela].descricaoChegada;
                }
            catch(error){
                console.log(error);
            }

            try{

                tabelaHorario4.innerText = quarto_posto[linha_tabela].tabela+'  '+quarto_posto[linha_tabela].descricaoSaida;
                horario7.innerText = quarto_posto[linha_tabela].saida;
                horario8.innerText = quarto_posto[linha_tabela].chegada;
                descricaoInfo4.innerText = quarto_posto[linha_tabela].descricaoChegada;
            }
            catch(error){
                console.log(error);
            }


        }

    }   

    gerar_pdf.disabled = false;
    gerar_planilha.disabled = false;
}

gerar_pdf.onclick = () =>{
    let vigencia = document.getElementById('vigencia');
    let codigo_linha = document.getElementById('codigo_linha');
    let nome_arquivo = codigo_linha.textContent+'-'+vigencia.textContent+'.pdf';
    nome_arquivo = nome_arquivo.replace(/\s+/g, '');
    let options = {};
    if(terceiro_posto!='' && quarto_posto!=''){
        options = {
        margin: [10,10,10,10],
        filename: nome_arquivo,
        html2canvas: {scale:1},
        jsPDF:{unit:'mm',format:'a3',orientation:'landscape'}
        }
    }
    else{
        options = {
        margin: [10,10,10,10],
        filename: nome_arquivo,
        html2canvas: {scale:2},
        jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
        }
    }
    
    

    html2pdf().set(options).from(quadro_content).save();
}

limpar_tabela = () =>{

    if(document.getElementById('tabela')){
        console.log('teste');

        primeiro_posto = [];
        segundo_posto = [];
        terceiro_posto = [];
        quarto_posto = [];

        nome_primeiro_posto = '';
        nome_segundo_posto = '';
        nome_terceiro_posto = '';
        nome_quarto_posto = '';
        tipo_linha = '';
        document.getElementById('tabela').remove();
    }        
}



gerar_planilha.onclick = () => {
    escrever_planilha();
}

async function escrever_planilha(){
    let vigencia = document.getElementById('vigencia');
    let codigo_linha = document.getElementById('codigo_linha');
    let numero_tabelas = document.getElementById('numero_tabelas');
    let numero_empresas = document.getElementById('numero_empresas');
    let tipo_dia = document.getElementById('tipo_dia');
    let classe_veiculo = document.getElementById('classe_veiculo');

    let linhas_planilha = document.getElementsByTagName('tr');
    let nome_arquivo = codigo_linha.textContent+'-'+vigencia.textContent+'.xlsx';
    nome_arquivo = nome_arquivo.replace(/\s+/g, '');;


    dados_planilha = [
        [codigo_linha.textContent,'',numero_tabelas.textContent,'',numero_empresas.textContent],
        [vigencia.textContent,'',tipo_dia.textContent,'',classe_veiculo.textContent],
        ['',''],
    ]


    for(tr=0;tr<linhas_planilha.length;tr++){
        let celulas = linhas_planilha[tr].cells;
        let linha_da_tabela = [];
        for(td=0;td<celulas.length;td++){
            
            linha_da_tabela.push(celulas[td].textContent);
        }
        dados_planilha.push(linha_da_tabela);
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Planilha');

    worksheet.addRows(dados_planilha);

    worksheet.mergeCells('A1:B1');
    worksheet.mergeCells('C1:D1');
    worksheet.mergeCells('E1:F1');
    worksheet.mergeCells('A2:B2');
    worksheet.mergeCells('C2:D2');
    worksheet.mergeCells('E2:F2');

    /*
    const estiloCabecalho = {
        font: { color: { argb: 'FFFFFF' } }, // Cor do texto branco (FFFFFF)
        alignment: { horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } } // Cor de fundo preta (000000)
      };
    */
    const estiloCelulasPares = {
        alignment: { horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } } // Cor de fundo cinza claro (DDDDDD)
      };
    
      const estiloCelulasImpares = {
        alignment: { horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EEEEEE' } } // Cor de fundo cinza mais claro (EEEEEE)
      };
    
      /*
      for (let col = 1; col <= dados_planilha[0].length; col++) {
        worksheet.getCell(getCellAddress(4, col)).style = estiloCabecalho;
      }
      */
      for (let row = 4; row <= dados_planilha.length; row++) {
        const estiloCelula = row % 2 === 0 ? estiloCelulasPares : estiloCelulasImpares;
        for (let col = 1; col <= dados_planilha[4].length; col++) {
          worksheet.getCell(getCellAddress(row, col)).style = estiloCelula;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
    
      const link = document.createElement('a');
      link.href = url;
      link.download = nome_arquivo;
      link.click();
}
   
    // Função auxiliar para obter o endereço da célula (A1, B2, etc.)
    function getCellAddress(row, col) {
      const colLetras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const coluna = colLetras.charAt(col - 1);
      return `${coluna}${row}`;
    }


   
    

    
