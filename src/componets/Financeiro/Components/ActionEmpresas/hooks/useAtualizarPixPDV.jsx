import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";

export const useAtualizarPixPDV = ({dadosPixPDV, handleClose, optionsModulos, usuarioLogado}) => {
    const [pixSelecionado, setPixSelecionado] = useState('')
    const [faturaSelecionado, setFaturaSelecionado] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');

    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        const response = await axios.get('http://ipwho.is/')
        if (response.data) {
        setIpUsuario(response.data.ip);
        }
        return response.data;
    }

    useEffect(() => {
        if (dadosPixPDV.length) {
            setPixSelecionado({value: dadosPixPDV[0]?.IDPSPPIX, label: dadosPixPDV[0]?.IDPSPPIX == '1' ? 'Itaú' : 'Santander'})
            setFaturaSelecionado({value: dadosPixPDV[0]?.IDPSPPIXFATURA, label: dadosPixPDV[0]?.IDPSPPIXFATURA == '1' ? 'Itaú' : 'Santander'})
        }
    }, [dadosPixPDV])

    const onSubmit = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro!',
                text: 'Usuário sem autorização para realizar a operação!',
                customClass: {
                container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000 
            });
            return
        }
        try {

            const putData = {
                IDEMPRESA: dadosPixPDV[0]?.IDEMPRESA,
                NOFANTASIA: dadosPixPDV[0]?.NOFANTASIA,
                IDPSPPIX: pixSelecionado,
                IDPSPPIXFATURA: faturaSelecionado,
                USER: usuarioLogado.id
            }
            let dados = JSON.stringify(putData)
            const response = await put('/atualizarConfiguracaoPixPDV', putData)
            Swal.fire({
                title: 'Sucesso',
                text: 'Despesa alterada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                container: 'custom-swal',
                }
            })
    
            const postData = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: `FINANCEIRO/EMPRESAS/ALTERACAO CONFIGURACAO PIX IDEMPRESA: ${dadosPixPDV[0]?.IDEMPRESA}`,
                DADOS: dados,
                IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
            handleClose()
            return responsePost.data
            
        } catch (error) {

            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro!',
                text: 'Usuário sem autorização para realizar a operação!',
                customClass: {
                container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000 
            });
            console.error('Erro ao atualizar configuração:', error);
        }
    }


    const optionsBancos = [
        { value: '1', label: 'Itaú' },
        { value: '2', label: 'Santander' },
    ]

    return {
        pixSelecionado,
        faturaSelecionado,
        setPixSelecionado,
        setFaturaSelecionado,
        usuarioLogado,
        optionsBancos,
        dadosPixPDV,
        onSubmit
    }
}