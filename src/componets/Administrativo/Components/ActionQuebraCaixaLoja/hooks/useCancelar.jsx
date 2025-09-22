import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";


export const useCancelarQuebraCaixa = ({usuarioLogado, optionsModulos, handleClick}) => {
    const [ipUsuario, setIpUsuario] = useState('');

    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        const response = await axios.get('http://ipwho.is/')
        if(response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    }

    const handleCancelar = async (IDQUEBRACAIXA, status) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
            title: 'Acesso Negado',
            text: 'Você não tem permissão para acessar esta funcionalidade.',
            icon: 'warning',
            timer: 3000,
            customClass: {
                container: 'custom-swal',
            }
            })
            return;
        }
        
        const putData = {  
            IDQUEBRACAIXA: IDQUEBRACAIXA,
            STATIVO: status ? 'True' : 'False'
        }

        try {
            const response = await put('/atualizar-status-quebra', putData)
            Swal.fire({
                title: 'Sucesso',
                text: `Quebra de Caixa ${status ? 'Ativada' : 'Cancelada'} com Sucesso`,
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(putData)
            let textoFuncao = status ? 'FINANCEIRO/ATIVADO QUEBRA DE CAIXA' : 'FINANCEIRO/CANCELAMENTO DE QUEBRA DE CAIXA';
        
            const postData = {  
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO:  textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
            handleClick();
            return responsePost.data;

        } catch (error) {

            let textoFuncao = status ? 'FINANCEIRO/ATIVADO QUEBRA DE CAIXA' : 'FINANCEIRO/CANCELAMENTO DE QUEBRA DE CAIXA';
        
            const postData = {  
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO:  textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
            handleClick();
            Swal.fire({
                title: 'Erro',
                text: `Erro ao Tentar ${status ? 'Ativar' : 'Cancelar'} a Quebra de Caixa`,
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            return responsePost.data;
        }
    
    }

    return {
        handleCancelar
    }
}