const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("apresenta detalhes e não tem violações axe no desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    const navegacao = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(navegacao.getByRole("link", { name: "Início" })).toBeVisible();
    await navegacao.getByRole("link", { name: "Como ajudar" }).click();
    await expect(page).toHaveURL(/#como-ajudar$/);
    await expect(page.getByRole("heading", { name: "Como ajudar" })).toBeVisible();
    await navegacao.getByRole("link", { name: "Sobre o projeto" }).click();
    await expect(page).toHaveURL(/#sobre$/);
    await expect(page.getByRole("heading", { name: "Informação clara aproxima quem quer ajudar." })).toBeVisible();
    await navegacao.getByRole("link", { name: "Campanhas" }).click();

    await expect(page.getByRole("heading", { name: "Campanhas abertas" })).toBeVisible();
    await expect(page.getByRole("heading", {
        name: "Campanha de demonstração (dados fictícios)",
    })).toBeVisible();
    await expect(page.getByText("1 campanha ativa")).toBeVisible();

    await page.getByText("Ver detalhes e como contribuir", { exact: true }).click();
    await expect(page.getByText(/Não realize doações; endereço ilustrativo para testes\./)).toBeVisible();
    const botaoCanal = page.getByRole("link", { name: "Acessar canal oficial de contribuição (abre em nova aba)" });
    await expect(botaoCanal).toBeVisible();
    await expect(botaoCanal).toHaveAttribute("href", "https://example.com/");
    await expect(botaoCanal).toHaveAttribute("rel", "noopener noreferrer");
    await page.screenshot({ path: "artifacts/pet-solidario-desktop.png", fullPage: true });

    const resultadoAxe = await new AxeBuilder({ page }).analyze();
    const problemasAxe = resultadoAxe.violations.map(({ id, nodes }) => ({
        id,
        elementos: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    }));
    expect(problemasAxe, JSON.stringify(problemasAxe, null, 2)).toEqual([]);
});

test("permite pular para o conteúdo e se adapta ao celular", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const linkPularConteudo = page.getByRole("link", { name: "Pular para o conteúdo principal" });
    await page.keyboard.press("Tab");
    await expect(linkPularConteudo).toBeFocused();
    const atalhoNaoCobreMarca = await page.evaluate(() => {
        const atalho = document.querySelector(".skip-link").getBoundingClientRect();
        const marca = document.querySelector(".brand").getBoundingClientRect();
        return atalho.bottom <= marca.top || atalho.right <= marca.left || atalho.left >= marca.right;
    });
    expect(atalhoNaoCobreMarca).toBe(true);
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo")).toBeFocused();
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();

    const larguraDocumento = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(larguraDocumento).toBeLessThanOrEqual(390);
    await page.screenshot({ path: "artifacts/pet-solidario-mobile.png", fullPage: true });

    const resultadoAxe = await new AxeBuilder({ page }).analyze();
    const problemasAxe = resultadoAxe.violations.map(({ id, nodes }) => ({
        id,
        elementos: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    }));
    expect(problemasAxe, JSON.stringify(problemasAxe, null, 2)).toEqual([]);
});
