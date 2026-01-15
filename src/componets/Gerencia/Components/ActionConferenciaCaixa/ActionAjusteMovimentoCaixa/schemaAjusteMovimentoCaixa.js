import * as yup from "yup";

// converte "1.234,56" ou "1234,56" ou "1234.56" em número
const moneyToNumber = (value, originalValue) => {
  if (originalValue === null || originalValue === undefined) return undefined;
  if (typeof originalValue === "number") return originalValue;

  const s = String(originalValue).trim();
  if (!s) return undefined;

  // remove R$, espaços, separador de milhar e troca vírgula por ponto
  const normalized = s
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const n = Number(normalized);
  return Number.isNaN(n) ? undefined : n;
};

export const schema = yup.object().shape({
  empresa: yup
    .string()
    .nullable()
    .optional(),

  operadorCaixa: yup
    .string()
    .nullable()
    .optional(),

  motivoAjusteSelecionado: yup
    .string()
    .trim()
    .required("Motivo do ajuste é obrigatório")
    .min(3, "Informe pelo menos 3 caracteres"),

  dataLancamento: yup
    .string()
    .required("Data lançamento é obrigatória")
    // se você estiver usando datetime-local, isso aqui ajuda:
    .test("is-valid-date", "Data lançamento inválida", (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !Number.isNaN(d.getTime());
    }),

  // readOnly no UI, mas se quiser validar:
  dinheiroInformado: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Dinheiro informado deve ser um número válido")
    .required("Dinheiro informado é obrigatório")
    .min(0, "Dinheiro informado não pode ser negativo"),

  dinheiroAjuste: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Dinheiro ajuste deve ser um número válido")
    .required("Dinheiro ajuste é obrigatório"),

  faturaInformada: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Fatura informada deve ser um número válido")
    .required("Fatura informada é obrigatória")
    .min(0, "Fatura informada não pode ser negativa"),

  faturaAjuste: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Fatura ajuste deve ser um número válido")
    .required("Fatura ajuste é obrigatória"),
});
