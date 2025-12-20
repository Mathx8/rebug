const n = (v) => Number(v ?? 0);

export function calcularPontuacao(p) {
  return (
    n(p.titulos) * 100 +
    n(p.vices) * 30 +
    n(p.mvp) * 50 +
    n(p.top1) * 40 +
    n(p.top2) * 20 +
    n(p.top3) * 10 +

    n(p.titulos_academy) * 10 +
    n(p.vices_academy) * 5 +
    n(p.mvp_academy) * 8 +
    n(p.t1_academy) * 7 +
    n(p.t2_academy) * 3 +
    n(p.t3_academy) * 1
  );
}