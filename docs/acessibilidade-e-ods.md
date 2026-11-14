# Acessibilidade e relação com os ODS

## Recursos implementados

- O documento usa idioma `pt-BR`, landmarks semânticos e uma hierarquia de títulos.
- O link “Pular para o conteúdo principal” permite passar direto pela navegação.
- Os elementos interativos podem ser alcançados pelo teclado e mostram foco visível.
- O estado de carregamento e a lista vazia são anunciados por uma região `status`; falhas usam uma região `alert` com uma ação para tentar novamente.
- Detalhes nativos (`details`/`summary`) permitem abrir e fechar as informações da campanha pelo teclado.
- O layout se adapta a telas estreitas, e os cartões são criados com `textContent`, sem interpretar o conteúdo da campanha como HTML.

Esses recursos são decisões de projeto voltadas à acessibilidade; não equivalem, por si só, a uma certificação de conformidade WCAG. Antes da entrega, valide a página manualmente e registre os resultados.

Além da checagem automatizada com axe-core no GitHub Actions, a execução do Playwright gera capturas de desktop e celular no artefato `evidencias-interface`. Os dados exibidos nessas capturas são fictícios e servem apenas para demonstrar a interface.

## Verificação manual para evidência

1. Abra a página em uma janela de desktop e em uma janela estreita, como a de um celular; confirme que não há rolagem horizontal.
2. Use `Tab` para chegar ao link “Pular para o conteúdo principal”; pressione `Enter` e confirme que o foco vai para o conteúdo.
3. Continue com `Tab` até “Tentar novamente” quando a API estiver indisponível; confirme que o foco é visível e que `Enter` e `Espaço` ativam o botão.
4. Com um leitor de tela, confira o título principal, o título “Campanhas abertas” e o anúncio dos estados de carregamento, lista vazia e falha.
5. Quando houver campanhas cadastradas, abra “Ver detalhes e como contribuir” usando o teclado e confira se as informações continuam legíveis com zoom de 200%.

Registre o resultado de cada verificação e tire capturas reais da página. Não marque como aprovado algo que não tenha sido conferido.

## Relação com os Objetivos de Desenvolvimento Sustentável

A página busca facilitar o acesso à informação para pessoas com diferentes habilidades e dispositivos. Essa intenção se relaciona ao ODS 10, especialmente à meta 10.2, que promove inclusão social, e à meta 10.3, que trata de igualdade de oportunidades e redução de desigualdades. A interface é uma contribuição de projeto para esses objetivos; ela não mede nem comprova o alcance das metas globais.

Referência: [ODS 10 — Redução das desigualdades, Nações Unidas](https://sdgs.un.org/goals/goal10).
