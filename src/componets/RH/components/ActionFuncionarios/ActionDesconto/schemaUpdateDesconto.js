import yup from 'yup';

export const schema = yup.object().shape({

    motivoDescontoFuncionario: yup
    .string()
    .required('Desconto Obrigatório'),

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

    
    dataIncio: yup
        .date()
        .required('Data inicio obrigatória'),

    dataFim: yup
        .date()
        .required('Data fim obrigatória'),

})