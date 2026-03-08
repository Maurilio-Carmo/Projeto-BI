// ═══════════════════════════════════════════════════════════════════════════
// RetailBI Sync — Database Schema Index
// Total: 46 tabelas
// ═══════════════════════════════════════════════════════════════════════════

// ── Classificação de produtos ────────────────────────────────────────────────
export * from './produto/secoes';
export * from './produto/grupos';
export * from './produto/subgrupos';
export * from './produto/marcas';
export * from './produto/familias';

// ── Produto — sub-tabelas (FK → products) ────────────────────────────────────
export * from './produto/produto';
export * from './produto/produto-impostos-federais';
export * from './produto/produto-estoque';
export * from './produto/produto-componentes';
export * from './produto/produto-pautas';
export * from './produto/produto-regimes';
export * from './produto/produto-codigos-auxiliares';
export * from './produto/produto-precos';
export * from './produto/produto-custos';
export * from './produto/produto-fornecedores';

// ── Pessoas ──────────────────────────────────────────────────────────────────
export * from './pessoa/clientes';
export * from './pessoa/cliente-enderecos';
export * from './pessoa/fornecedores';

// ── Fiscal ───────────────────────────────────────────────────────────────────
export * from './fiscal/situacoes-fiscais';
export * from './fiscal/operacoes-fiscais';
export * from './fiscal/operacoes-fiscais-cfops';
export * from './fiscal/cenarios-fiscais-ncm';
export * from './fiscal/cenario-fiscal-ncm-ncms';
export * from './fiscal/cenario-fiscal-ncm-lojas';
export * from './fiscal/cenario-fiscal-ncm-ufs-destino';
export * from './fiscal/impostos-federais';
export * from './fiscal/impostos-federais-geral';
export * from './fiscal/tabelas-tributarias';
export * from './fiscal/tabelas-tributarias-itens';

// ── Financeiro ───────────────────────────────────────────────────────────────
export * from './financeiro/agentes-financeiros';
export * from './financeiro/categorias-financeiras';
export * from './financeiro/contas-correntes';
export * from './financeiro/historicos-padrao';
export * from './financeiro/pagamentos-pdv';
export * from './financeiro/pagamentos-pdv-lojas';
export * from './financeiro/recebimentos-pdv';
export * from './financeiro/recebimentos-pdv-lojas';

// ── Estoque ───────────────────────────────────────────────────────────────────
export * from './estoque/locais-estoque';
export * from './estoque/estoque-saldos';
export * from './estoque/tipos-ajuste-estoque';

// ── Frente de Loja ────────────────────────────────────────────────────────────
export * from './frente-loja/encartes';
export * from './frente-loja/encarte-produtos';
export * from './frente-loja/encarte-lojas';
export * from './frente-loja/motivos-acrescimo';
export * from './frente-loja/motivos-desconto';
export * from './frente-loja/motivos-devolucao';
export * from './frente-loja/motivos-cancelamento';

// ── Transações ────────────────────────────────────────────────────────────────
export * from './transacoes/notas-compra';
export * from './transacoes/notas-compra-itens';
export * from './transacoes/notas-venda';
export * from './transacoes/notas-venda-itens';
export * from './transacoes/cupons-fiscais';
export * from './transacoes/cupons-itens';
export * from './transacoes/cupons-finalizacoes';

// ── Infraestrutura de Sync ────────────────────────────────────────────────────
export * from './infra/credencial';
export * from './infra/sync-config';
export * from './infra/sync-logs';
export * from './infra/import-stats';
