export const STATUS_MAP = {
  0: { label: 'Em Elaboração', color: '#6B7280', bg: '#F3F4F6' },
  1: { label: 'Enviado',       color: '#1D4ED8', bg: '#EFF6FF' },
  2: { label: 'Aprovado',      color: '#15803D', bg: '#F0FDF4' },
  3: { label: 'Reprovado',     color: '#B91C1C', bg: '#FEF2F2' },
};

export function statusLabel(s) {
  return STATUS_MAP[s]?.label ?? 'Desconhecido';
}
