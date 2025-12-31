import * as yup from "yup";
export const schema = yup.object({
    historico: yup.string().required("O campo Histórico é obrigatório."),
    valorDespesa: yup.string().required("O campo Valor Despesa é obrigatório."),
    funcionario: yup.object().required("O campo Funcionário é obrigatório."),
})