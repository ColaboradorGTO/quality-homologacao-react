import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";

export const useAtivarCancelar = ({ usuarioLogado, handleClick, IDADIANTAMENTOSALARIO, status }) => {
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


    const handleAtivar = async (IDADIANTAMENTOSALARIO, STATIVO) => {
        
        Swal.fire({
            title: `Tem Certeza que Deseja ${status ? 'Ativar' : 'Cancelar'} o Adiantamento?`,
            text: 'Você não poderá reverter a ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger',
                loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const putData = {
                        IDADIANTAMENTOSALARIO: IDADIANTAMENTOSALARIO,
                        STATIVO: 'True' 
                    }
                    const response = await put('/atualizacao-adiantamento-status', putData)
                    const textDados = JSON.stringify(putData)
                    let textoFuncao = status ? 'FINANCEIRO/ATIVADO O ADIANTAMENTO SALARIAL' : 'FINANCEIRO/CANCELADO O ADIANTAMENTO SALARIAL';
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario
                    }
                    
                    const responsePost = await post('/log-web', postData)
                    
                    console.log(postData, 'postData');
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });
                    handleClick()
                    return responsePost;
                } catch (error) {
                    let textoFuncao = status ? 'FINANCEIRO/ERRO ADIANTAMENTO SALARIAL' : 'FINANCEIRO/ERRO CANCELAR ADIANTAMENTO SALARIAL';

                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: '',
                        IP: ipUsuario
                    }
                    console.log(postData, 'postData');
                    const responsePost = await post('/log-web', postData)
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });

                    return responsePost.data;
                }
            }
        })
    }

    const handleCancelar = async (IDADIANTAMENTOSALARIO, STATIVO) => {
    
        Swal.fire({
            title: `Tem Certeza que Deseja ${status ? 'Ativar' : 'Cancelar'} o Adiantamento?`,
            text: 'Você não poderá reverter a ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger',
                loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const putData = {
                        IDADIANTAMENTOSALARIO: IDADIANTAMENTOSALARIO,
                        STATIVO: 'False' 
                    }
                    const response = await put('/atualizacao-adiantamento-status', putData)
                    const textDados = JSON.stringify(putData)
                    let textoFuncao = status ? 'FINANCEIRO/ATIVADO O ADIANTAMENTO SALARIAL' : 'FINANCEIRO/CANCELADO O ADIANTAMENTO SALARIAL';
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario
                    }
                    
                    const responsePost = await post('/log-web', postData)
                    
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });
                    
                    handleClick()
                    return responsePost.data;
                } catch (error) {
                    let textoFuncao = status ? 'FINANCEIRO/ERRO ADIANTAMENTO SALARIAL' : 'FINANCEIRO/ERRO CANCELAR ADIANTAMENTO SALARIAL';

                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: '',
                        IP: ipUsuario
                    }

                    const responsePost = await post('/log-web', postData)
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });

                    return responsePost.data;
                }
            }
        })
    }

    return { handleAtivar, handleCancelar, ipUsuario };
}