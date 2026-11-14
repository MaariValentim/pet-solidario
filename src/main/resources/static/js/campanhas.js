const listaCampanhas = document.querySelector("#lista-campanhas");
const estadoCarregamento = document.querySelector("#estado-carregamento");
const estadoErro = document.querySelector("#estado-erro");
const botaoTentarNovamente = document.querySelector("#tentar-novamente");
const totalCampanhas = document.querySelector("#total-campanhas");

function atualizarContagemCampanhas(total) {
    totalCampanhas.textContent = `${total} ${total === 1 ? "campanha ativa" : "campanhas ativas"}`;
}

function adicionarTexto(container, label, value) {
    const paragrafo = document.createElement("p");
    const rotulo = document.createElement("strong");
    rotulo.textContent = `${label}: `;
    const texto = value ?? "";
    const endereco = texto.match(/https?:\/\/[^\s<>"']+/i)?.[0];
    paragrafo.append(rotulo);

    if (!endereco) {
        paragrafo.append(document.createTextNode(texto));
        container.append(paragrafo);
        return;
    }

    let url;
    try {
        url = new URL(endereco);
    } catch {
        paragrafo.append(document.createTextNode(texto));
        container.append(paragrafo);
        return;
    }

    if (!["https:", "http:"].includes(url.protocol)) {
        paragrafo.append(document.createTextNode(texto));
        container.append(paragrafo);
        return;
    }

    const inicio = texto.indexOf(endereco);
    const link = document.createElement("a");
    link.className = "button contribution-link";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Acessar canal oficial";
    link.setAttribute("aria-label", "Acessar canal oficial de contribuição (abre em nova aba)");
    paragrafo.append(document.createTextNode(texto.slice(0, inicio)), link,
        document.createTextNode(texto.slice(inicio + endereco.length)));
    container.append(paragrafo);
}

function criarCartao(campanha) {
    const item = document.createElement("li");
    const cartao = document.createElement("article");
    const cabecalho = document.createElement("div");
    const instituicao = document.createElement("span");
    const status = document.createElement("span");
    const titulo = document.createElement("h3");
    const resumo = document.createElement("p");
    const detalhes = document.createElement("details");
    const abrirDetalhes = document.createElement("summary");
    const descricao = document.createElement("p");

    cartao.className = "campaign-card";
    cabecalho.className = "campaign-card-top";
    instituicao.className = "campaign-type";
    instituicao.textContent = campanha.instituicao;
    status.className = "campaign-status";
    status.textContent = "Ativa";
    titulo.textContent = campanha.titulo;
    resumo.className = "campaign-summary";
    resumo.textContent = campanha.resumo;
    abrirDetalhes.textContent = "Ver detalhes e como contribuir";
    descricao.textContent = campanha.descricao;

    detalhes.append(abrirDetalhes, descricao);
    adicionarTexto(detalhes, "Como contribuir", campanha.comoContribuir);
    cabecalho.append(instituicao, status);
    cartao.append(cabecalho, titulo, resumo, detalhes);
    item.append(cartao);

    return item;
}

async function carregarCampanhas() {
    estadoErro.hidden = true;
    estadoCarregamento.hidden = false;
    estadoCarregamento.textContent = "Carregando campanhas...";
    listaCampanhas.replaceChildren();

    try {
        const resposta = await fetch("/api/campanhas", {
            headers: { Accept: "application/json" },
        });

        if (!resposta.ok) {
            throw new Error(`A API respondeu com status ${resposta.status}.`);
        }

        const campanhas = await resposta.json();
        if (!Array.isArray(campanhas)) {
            throw new Error("A resposta da API não contém uma lista de campanhas.");
        }

        atualizarContagemCampanhas(campanhas.length);

        if (campanhas.length === 0) {
            estadoCarregamento.textContent =
                "Nenhuma campanha aberta foi publicada ainda. Volte em breve.";
            return;
        }

        estadoCarregamento.textContent = `${campanhas.length} ${campanhas.length === 1 ? "campanha aberta encontrada" : "campanhas abertas encontradas"}.`;
        listaCampanhas.append(...campanhas.map(criarCartao));
    } catch {
        totalCampanhas.textContent = "Campanhas indisponíveis";
        estadoCarregamento.hidden = true;
        estadoErro.hidden = false;
    }
}

botaoTentarNovamente.addEventListener("click", carregarCampanhas);
carregarCampanhas();
