import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";

export const useEmitirNFE = ({usuarioLogado, optionsModulos, handleClick }) => {
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

    const handleFaturarOT = async (row) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Atenção',
                text: 'Você não tem permissão para Emitir NFE.',
                icon: 'warning',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        
        Swal.fire({
            icon: 'question',
            title: `Deseja Realmente Emitir NFE?`,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonColor: '#FD1381',
            confirmButtonColor: '#7352A5',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                container: 'custom-swal',
            },
            timer: 3000,
            preConfirm: async () => {
                const putData = {
                    IDSTATUSOT: parseInt(3),
                    IDRESUMOT: parseInt(row.IDRESUMOT),
                    IDEMPRESAORIGEM: parseInt(row.IDEMPRESAORIGEM),
                };
                try {
                    await put('/resumo-ordem-transferencia/:id', putData);
                
                    let textDados = JSON.stringify(putData);
                    let textoFuncao = `GERENCIA/NFE Emitida com sucesso!`;
                    await getIPUsuario();
                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario
                    }

                    const responsePost = await post('/log-web', createData);

                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'NFE Emitida com Sucesso',
                        icon: 'success',
                        confirmButtonColor: '#7352A5',
                        customClass: {
                            container: 'custom-swal',
                        }
                    });
                    handleClick();
                    return responsePost.data;
                } catch (error) {
                    let textoFuncao = 'GERENCIA/ERRO AO EMITIR NFE';
                    await getIPUsuario();
                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: 'GERENCIA/ERRO AO EMITIR NFE',
                        IP: ipUsuario   
                    };

                    await post('/log-web', createData);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao emitir NFE',
                        text: error.message,
                        timer: 5000,
                    });
                    handleClick();
                    throw error;
                }
            }
        })
    };

    return {
        handleFaturarOT
    }
}