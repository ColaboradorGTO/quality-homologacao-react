import { useState } from "react";
import { post } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";

export const useIntegrarAdiantamento = ({optionsModulos, usuarioLogado, handleClick}) => {
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

    const confirmar = async (rowData) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar a fatura.`,
                showConfirmButton: true,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        Swal.fire({
            title: 'Certeza que Deseja Integrar o Adiantamento?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
                actions: 'swal-button-spacing'
            },
            buttonsStyling: false,
            didOpen: () => {
                const style = document.createElement('style');
                style.innerHTML = '.swal-button-spacing button { margin: 0 5px; }';
                document.head.appendChild(style);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const putData = {
                    IDADIANTAMENTOSALARIO: parseInt(rowData.IDADIANTAMENTOSALARIO),
                    IDFUNCIONARIO: Number(usuarioLogado.id),
                }

                try {
        
                    const response = await post('/adiantamentos-salariais-integracao', putData)
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/INTEGRAR ADIANTAMENTO SALARIAL`,
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
        
                    handleClick();
                    return response.data;
                } catch (error) {
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/ERRO AO INTEGRAR ADIANTAMENTO SALARIAL`,
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
                    console.error('Erro Integrar Adiantamento Salarial:', error);
                    return responsePost.data;
                }
            } else {
                return;
            }
        });

    }


    return {
        confirmar
    }
}