import Swal from "sweetalert2"
import { post, put } from "../../../../../api/funcRequest"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export const useCancelarFatura = ({dadosCancelarFatura, usuarioLogado, optionsModulos}) => {
    const [motivo, setMotivo] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
        setIpUsuario(response.data.ip);
    }
    return response.data;
    }

    useEffect(() => {
        getIPUsuario()
    }, [usuarioLogado])
    

    const onSubmit = async () => {
    const putData = {
        IDDETALHEFATURA: dadosCancelarFatura[0]?.IDDETALHEFATURA,
        TXTMOTIVOCANCELAMENTO: motivo,
        STCANCELADO:'True',
        IDUSRCACELAMENTO: usuarioLogado.id,  
    }

    try {

        const response = await put('/atualizar-detalhe-fatura-loja', putData)
        Swal.fire({
        title: 'Atualização',
        text: 'Atualização Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
            container: 'custom-swal',
        }
        })

        const textDados = JSON.stringify(putData)
        let textoFuncao = 'GERENCIA/ATUALIZAR FATURA CANCELAMENTO';
    
    
        const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
        }
    
        const responsePost = await post('/log-web', postData)
    
        
        return responsePost.data;
    } catch (error) {
        Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Confimar Alteração',
        icon: 'error',
        timer: 3000,
        customClass: {
            container: 'custom-swal',
        }
        })
        console.error('Erro ao parsear o usuário do localStorage:', error);
    }
    }

    return {
        motivo,
        setMotivo,
        onSubmit
    }
}