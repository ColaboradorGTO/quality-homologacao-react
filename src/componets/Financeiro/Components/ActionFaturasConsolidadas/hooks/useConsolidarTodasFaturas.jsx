import { useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";

export const useConsolidarTodasFaturas = ({
    optionsModulos, 
    usuarioLogado, 
    handleClickConciliar,
    selectedItems,
}) => {
    const [ipUsuario, setIpUsuario] = useState('');

    const getIPUsuario = async () => {
        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            let usuarioIP = ipWhoisData?.ip;

            if (!usuarioIP) {
            const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
            usuarioIP = ipifyData?.ip;
            }

            setIpUsuario(usuarioIP);
            return usuarioIP;
        } catch (error) {
            console.error("Erro ao buscar IP:", error);
            return null;
        }
    };



    const conferirTodas = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para integrar as consolidações.`,
                showConfirmButton: true,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        Swal.fire({
            title: 'Deseja Integrar Todas as Consolidações Selecionadas no SAP?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        }).then(async (result) => {

            if (result.isConfirmed) {
            
                const idsFaturas = selectedItems.map(item => item.IDCONSOLIDACAOFATURA).join(',');
                const putData = {   
                    IDS_CONSOLIDACOES: idsFaturas.replace(/(^,|,$)/g, ''),
                    IDFUNCIONARIO: parseInt(usuarioLogado.id),
                }
        
                try {
        
                    const response = await post('/consolidacao-faturas-integracao', putData)
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/INTEGRAR TODAS CONSOLIDACOES FATURAS SELECIONADAS`,
                        DADOS: textDados,
                        IP: ipUsuario
                    }
                    
                    await post('/log-web', postData)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Atualizado com sucesso!',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal', 
                        },
                    })
        
                    handleClickConciliar();
                    return response.data;   
                } catch (error) {
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/ERRO AO INTEGRAR TODAS CONSOLIDACOES FATURAS SELECIONADAS`,
                        DADOS: textDados,
                        IP: ipUsuario
                    }
                    
                    const responsePost = await post('/log-web', postData)
        
        
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal', 
                        },
                    });
                    console.error('Erro Conferir Todas Faturas:', error);
                    return responsePost.data;
                }
            } else {
                return;
            }
        });
        
    }

    
    return {
        conferirTodas,
    }
}