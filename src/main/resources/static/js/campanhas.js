const listaCampanhas = document.querySelector("#lista-campanhas");
const estadoCarregamento = document.querySelector("#estado-carregamento");
const estadoErro = document.querySelector("#estado-erro");
const botaoTentarNovamente = document.querySelector("#tentar-novamente");

function adicionarTexto(container, label, value) {
    const paragrafo = document.createElement("p");
    const rotulo = document.createElement("strong");
    rotulo.textContent = `${label}: `;
    paragrafo.append(rotulo, document.createTextNode(value ?? ""));
    container.append(paragrafo);
}

function criarCartao(campanha) {
    const item = document.createElement("li");
    const cartao = document.createElement("article");
    const titulo = document.createElement("h3");
    const resumo = document.createElement("p");
    const detalhes = document.createElement("details");
    const abrirDetalhes = document.createElement("summary");
    const descricao = document.createElement("p");

    cartao.className = "campaign-card";
    titulo.textContent = campanha.titulo;
    resumo.className = "campaign-summary";
    resumo.textContent = campanha.resumo;
    abrirDetalhes.textContent = "Ver detalhes e como contribuir";
    descricao.textContent = campanha.descricao;

    detalhes.append(abrirDetalhes, descricao);
    adicionarTexto(detalhes, "Instituição", campanha.instituicao);
    adicionarTexto(detalhes, "Como contribuir", campanha.comoContribuir);
    cartao.append(titulo, resumo, detalhes);
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

        if (campanhas.length === 0) {
            estadoCarregamento.textContent =
                "Nenhuma campanha aberta foi publicada ainda. Volte em breve.";
            return;
        }

        estadoCarregamento.textContent = `${campanhas.length} ${campanhas.length === 1 ? "campanha aberta encontrada" : "campanhas abertas encontradas"}.`;
        listaCampanhas.append(...campanhas.map(criarCartao));
    } catch {
        estadoCarregamento.hidden = true;
        estadoErro.hidden = false;
    }
}

botaoTentarNovamente.addEventListener("click", carregarCampanhas);
carregarCampanhas();
