import * as yup from "yup";


/**
 * Validação de schema para formulário de pagamento
 * 
 * Define as regras de validação para os campos de pagamento:
 * - vrDinheiro: Valor em dinheiro que aceita formato brasileiro (com virgula e ponto)
 *   e o transforma em número decimal padrão. Exibe erro se formato inválido.
 * 
 * - vrPix: Valor em Pix que aceita formato brasileiro (com virgula e ponto)
 *   e o transforma em número decimal padrão. Exibe erro se formato inválido.
 * 
 * - chavePix: Chave Pix que é validada condicionalmente:
 *   Se vrPix > 0, o campo é obrigatório com mensagem de erro específica.
 *   Caso contrário, o campo não é obrigatório.
 * 
 * @type {yup.ObjectSchema}
 * @example
 * const dados = await schema.validate({ vrDinheiro: '100,50', vrPix: '50,00', chavePix: 'chave@pix' })
 */
export const schema = yup.object({
    historico: yup.string().required('Histórico é obrigatório'),
    pagoA: yup.string().required('Pago A é obrigatório'),
    valorDespesa: yup.string()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Valor em Dinheiro inválido')
    .required('Valor da Despesa é obrigatório'),
});