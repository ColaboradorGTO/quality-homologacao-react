import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";

export const useEditarDeposito = ({ optionsModulos, usuarioLogado, handleClick }) => {
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

    const handleCancelar = async (IDDEPOSITOLOJA) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para cancelar a conciliação do depósito!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        Swal.fire({
            title: 'Tem Certeza que Deseja Cancelar a Conciliação do Depósito?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Confirmar',
            confirmButtonText: 'Cancelar',
            html: '<input type="date" id="dtOriginal" name="dtOriginal" class="form-control" value="" >',
            customClass: {
                confirmButton: 'btn btn-success mx-2',
                cancelButton: 'btn btn-danger mx-2',
                loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                const dtOriginal = document.getElementById('dtOriginal').value;
                try {
                    const putData = {
                        IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                        DTMOVIMENTOCAIXA: dtOriginal
                    }

                    const response = await put('/deposito-alteracao-data-movimento/:id', putData)
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario()
                    let textoFuncao = 'FINANCEIRO/ALTERAÇÃO DATA DE MOVIMENTO DO DEPOSITO';

                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario,
                    }

                    await post('/log-web', postData)

                    Swal.fire({
                        title: 'Alterado',
                        text: 'Data de Movimento Alterada Com Sucesso!',
                        icon: 'success'
                    })
                    handleClick()

                    return response.data;
                } catch (error) {
                    const putData = {
                        IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                        DTMOVIMENTOCAIXA: dtOriginal
                    }
                    const textDados = JSON.stringify(putData)
                    let textoFuncao = 'FINANCEIRO/ERRO AO ALTERAR DATA DE MOVIMENTO DO DEPOSITO';
                    const ipUsuario = await getIPUsuario()
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario,
                    }

                    const responsePost = await post('/log-web', postData)


                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Erro ao alterar a data de movimento do depósito!',
                        customClass: {
                            container: 'custom-swal',
                        },
                        showConfirmButton: false,
                        timer: 4000
                    });
                    handleClick()
                    return responsePost.data;
                }
            }
        })

    }

    return {
        handleCancelar,
        ipUsuario,
        getIPUsuario,
        setIpUsuario,
    }
}