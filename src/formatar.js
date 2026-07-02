const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];

// Recebe a data como está guardada no JSON ("2026-08-14") e devolve o jeito
// que se lê em português: "14 de agosto de 2026". O que não for uma data
// nesse formato volta como veio.
export function formatarData(iso) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ""));
  if (!partes) {
    return String(iso ?? "");
  }
  const [, ano, mes, dia] = partes;
  return `${Number(dia)} de ${MESES[Number(mes) - 1]} de ${ano}`;
}
