-- Registros de demonstração para apresentar diferentes necessidades na interface.
-- Eles não representam pedidos confirmados pela instituição.
INSERT INTO campanhas (
    titulo,
    resumo,
    descricao,
    instituicao,
    como_contribuir,
    status
) VALUES
(
    'Demonstrativa: apoio com ração',
    'Exemplo de campanha para demonstrar a divulgação de uma necessidade de alimentação animal.',
    'Este registro é demonstrativo e não confirma uma solicitação atual da Casa dos Gatos. Consulte a instituição para verificar se há necessidade de ração, quais tipos são adequados e como realizar uma eventual contribuição.',
    'Casa dos Gatos (dados demonstrativos)',
    'Confirme a necessidade e as orientações diretamente com a instituição: https://linktr.ee/casadosgatos.araraquara',
    'ABERTA'
),
(
    'Demonstrativa: apoio com sachês',
    'Exemplo de campanha para demonstrar a divulgação de uma necessidade de alimentação úmida.',
    'Este registro é demonstrativo e não confirma uma solicitação atual da Casa dos Gatos. Antes de comprar ou entregar sachês, consulte a instituição para verificar a necessidade, as especificações e a forma de recebimento.',
    'Casa dos Gatos (dados demonstrativos)',
    'Confirme a necessidade e as orientações diretamente com a instituição: https://linktr.ee/casadosgatos.araraquara',
    'ABERTA'
);
