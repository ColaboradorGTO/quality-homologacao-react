import * as yup from "yup";


export const schema = yup.object({
  vrDinheiro: yup.string()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Valor em Dinheiro inválido')
    
});