import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import axios from "axios";

export const useEmitirNFE = ({row, usuarioLogado, optionsModulos, handleClick }) => {
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
                    IDRESUMOT: row.IDRESUMOT,
                    IDEMPRESAORIGEM: row.IDEMPRESAORIGEM,
                };
                try {
                    await put('/resumo-ordem-transferencia/:id', putData);
                
                    let textDados = JSON.stringify(putData);
                    let textoFuncao = `GERENCIA/NFE Emitida com sucesso!`;

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