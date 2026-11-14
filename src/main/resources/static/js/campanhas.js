const listaCampanhas = document.querySelector("#lista-campanhas");
const estadoCarregamento = document.querySelector("#estado-carregamento");
const estadoErro = document.querySelector("#estado-erro");
const botaoTentarNovamente = document.querySelector("#tentar-novamente");
const totalCampanhas = document.querySelector("#total-campanhas");
const apiBaseUrl = (window.PET_SOLIDARIO_API_BASE_URL || "").replace(/\/$/, "");

function atualizarContagemCampanhas(total) {
    totalCampanhas.textContent = `${total} ${total === 1 ? "campanha ativa" : "campanhas ativas"}`;
}

function criarIcone(emoji) {
    const icone = document.createElement("span");
    icone.className = "icon";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = emoji;
    return icone;
}

// Escolhe um emoji pelo tema da campanha; usa a patinha quando não reconhece.
function iconeDaCampanha(campanha) {
    const tema = `${campanha.instituicao ?? ""} ${campanha.titulo ?? ""} ${campanha.resumo ?? ""}`.toLowerCase();
    const temas = [
        [/aliment|ração|racao|comida|sachê|sache/, "🍽️"],
        [/higiene|limpeza/, "🧼"],
        [/conforto|cama|manta|abrigo/, "🛏️"],
        [/veterin|saúde|saude|remédio|remedio|vacina|castra/, "🩺"],
        [/brinqued/, "🧶"],
    ];
    return temas.find(([regra]) => regra.test(tema))?.[1] ?? "🐾";
}

function adicionarTexto(container, label, value) {
    const paragrafo = document.createElement("p");
    const rotulo = document.createElement("strong");
    rotulo.append(criarIcone("💛"), document.createTextNode(`${label}: `));
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
    const nomeInstituicao = campanha.instituicao || "Instituição não informada";
    instituicao.setAttribute("aria-label", `Instituição da campanha: ${nomeInstituicao}`);
    instituicao.append(
        criarIcone(iconeDaCampanha(campanha)),
        document.createTextNode(`Instituição: ${nomeInstituicao}`),
    );
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
        const resposta = await fetch(`${apiBaseUrl}/api/campanhas`, {
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
