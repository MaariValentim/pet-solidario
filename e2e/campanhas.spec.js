const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("apresenta detalhes e não tem violações axe no desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Campanhas abertas" })).toBeVisible();
    await expect(page.getByRole("heading", {
        name: "Campanha de demonstração (dados fictícios)",
    })).toBeVisible();

    await page.getByText("Ver detalhes e como contribuir", { exact: true }).click();
    await expect(page.getByText("Não realize doações. Este texto é apenas um dado de teste.")).toBeVisible();
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
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo")).toBeFocused();

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
