import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";

export const useUpdateStatusDeposito = ({ handleClick, optionsModulos, usuarioLogado, empresaSelecionada }) => {
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

    const handleCancelar = async (IDDEPOSITOLOJA, STCANCELADO) => {
        console.log(optionsModulos[0])
        if (optionsModulos[0]?.ALTERAR == 'True') {
            try {

                Swal.fire({
                    title: 'Certeza que Deseja Cancelar o Depósito?',
                    text: 'Você não poderá reverter o cancelamento!',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const dados = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            STCANCELADO: 'True',
                        };

                        await put("/deposito-loja-atualizacao-status/:id", dados);


                        const textdados = JSON.stringify(dados);
                        const textoFuncao = 'FINANCEIRO/CANCELAR DEPOSITO VIA EXTRATO';
                        const dadosLog = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: textdados,
                            IP: ipUsuario
                        };

                        await post("/log-web", dadosLog);
                        handleClick();
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Depósito cancelado com sucesso.',
                            icon: 'success',
                        });

                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        let textoFuncao = 'FINANCEIRO/ERRO AO CANCELAR DEPOSITO VIA EXTRATO';
                        const dadosLog = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: '',
                            IP: ipUsuario
                        };
                        await post("/log-web", dadosLog);
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao Cancelar Depósito.',
                            icon: 'error',
                        });
                    }
                });
            } catch (error) {
                console.error('Erro: ', error);
            }
        } else {
            Swal.fire({
                title: 'Atenção!',
                text: 'Você não tem permissão para cancelar este registro.',
                icon: 'warning'
            });
        }
    };

    // ✅ CORRETO: Return deve estar FORA da função handleCancelar
    return {
        handleCancelar
    };

}