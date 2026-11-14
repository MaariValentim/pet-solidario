const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const reportPath = resolve("target/site/jacoco/jacoco.xml");

let xml;
try {
    xml = readFileSync(reportPath, "utf8");
} catch {
    console.error(`Relatório JaCoCo não encontrado: ${reportPath}`);
    process.exit(1);
}

// JaCoCo grava os totais agregados depois dos contadores de classes e pacotes.
const counters = [...xml.matchAll(/<counter\b([^>]*?)\/>/g)]
    .map((match) => Object.fromEntries(
        [...match[1].matchAll(/([\w-]+)="([^"]*)"/g)]
            .map(([, name, value]) => [name, value]),
    ));
const lineCounter = counters.filter((counter) => counter.type === "LINE").at(-1);

if (!lineCounter) {
    console.error("O relatório JaCoCo não contém a métrica de linhas.");
    process.exit(1);
}

const covered = Number(lineCounter.covered);
const missed = Number(lineCounter.missed);
const total = covered + missed;

if (!Number.isFinite(total) || total === 0) {
    console.error("O relatório JaCoCo não contém linhas instrumentadas.");
    process.exit(1);
}

const percentage = Math.round((covered * 100) / total);
console.log(`Cobertura de linhas: ${percentage}% (${covered}/${total})`);
console.log(`COVERAGE_PERCENTAGE=${percentage}`);
