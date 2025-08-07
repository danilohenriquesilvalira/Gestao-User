/**
 * Funções utilitárias para validação de dados do PLC
 */

/**
 * Limita valor entre 0 e 100 (para níveis, contrapresos, porta)
 */
export function limitPercentage(value: number | null | undefined): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
}

/**
 * Limita status do motor entre 0, 1 e 2
 * 0 = Inativo, 1 = Operando, 2 = Falha
 */
export function limitMotorStatus(value: number | null | undefined): 0 | 1 | 2 {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  const limited = Math.max(0, Math.min(2, Math.floor(value)));
  return limited as 0 | 1 | 2;
}

/**
 * Valida se um valor está dentro do range esperado
 */
export function isValidRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max && !isNaN(value);
}

/**
 * Formata valor percentual para exibição
 */
export function formatPercentage(value: number | null | undefined): string {
  const limited = limitPercentage(value);
  return `${limited.toFixed(1)}%`;
}

/**
 * Formata status do motor para exibição
 */
export function formatMotorStatus(value: number | null | undefined): string {
  const status = limitMotorStatus(value);
  switch (status) {
    case 0: return 'INATIVO';
    case 1: return 'OPERANDO';
    case 2: return 'FALHA';
    default: return 'DESCONHECIDO';
  }
}

/**
 * Define limites para cada tipo de tag do PLC
 */
export const PLC_LIMITS = {
  PERCENTAGE: { min: 0, max: 100 }, // Níveis, contrapresos, porta
  MOTOR_STATUS: { min: 0, max: 2 }, // Status dos motores
  BOOLEAN: { min: 0, max: 1 }       // Semáforos
} as const;

/**
 * Aplica validação completa baseada no tipo de tag
 */
export function validatePLCValue(value: any, type: 'percentage' | 'motor' | 'boolean'): number {
  switch (type) {
    case 'percentage':
      return limitPercentage(value);
    case 'motor':
      return limitMotorStatus(value);
    case 'boolean':
      return value ? 1 : 0;
    default:
      return 0;
  }
}
