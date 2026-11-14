const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

const staticRoot = path.resolve("src/main/resources/static");
const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
};

const campanhaDemonstrativa = [{
    titulo: "Campanha de demonstração (dados fictícios)",
    resumo: "Exemplo usado apenas para verificar a apresentação da interface.",
    descricao: "Esta campanha é fictícia e existe somente para os testes visuais.",
    instituicao: "Instituição fictícia de demonstração",
    comoContribuir: "Acesse https://example.com/ para ver o canal fictício. Não realize doações; endereço ilustrativo para testes.",
    status: "ABERTA",
}];

const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;

    if (request.method !== "GET") {
        response.writeHead(405).end();
        return;
    }

    if (pathname === "/api/campanhas") {
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(campanhaDemonstrativa));
        return;
    }

    const relativePath = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
    const filePath = path.resolve(staticRoot, relativePath);
    if (filePath !== staticRoot && !filePath.startsWith(`${staticRoot}${path.sep}`)) {
        response.writeHead(403).end();
        return;
    }

    try {
        const contents = await readFile(filePath);
        const contentType = mimeTypes[path.extname(filePath)] ?? "application/octet-stream";
        response.writeHead(200, { "Content-Type": contentType });
        response.end(contents);
    } catch {
        response.writeHead(404).end();
    }
});

server.listen(4173, "127.0.0.1");
