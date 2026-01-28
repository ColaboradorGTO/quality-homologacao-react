import * as yup from "yup";

export const schema = yup.object().shape({
    descontoAutorizado: yup
        .string()
        .transform((value) => {
            if (typeof value === 'string') {
                return value === '' ? null : Number(value);
            }
            return value;
        })
        .typeError('Desconto é obrigatorio')
        .max(50, 'Desconto não pode ser maior que 50%')
        .required('Desconto é obrigatório'),

})