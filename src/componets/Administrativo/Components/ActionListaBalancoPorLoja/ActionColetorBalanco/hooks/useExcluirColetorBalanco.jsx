import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2"
import axios from "axios";
import { put } from "../../../../../../api/funcRequest";


export const useExcluirColetorBalanco = ({ optionsModulos, usuarioLogado }) => {
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

    const handleClickExcluir = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
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

        const data = {
            IDRESUMOBALANCO: row.IDRESUMOBALANCO,
            NUMEROCOLETOR: row.NUMEROCOLETOR
        }

        try {

            Swal.fire({
                title: 'Deseja excluir o Coletor?',
                text: 'Caso exclua, será necessário subir novamente pelo PDV!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                  customClass: {
                    container: 'custom-swal',
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'O coletor foi excluido com sucesso.',
                        icon: 'success',
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal',
                        }
                    })

                    const response = await put(`/coletor-balanco/:id`, data)

                    let textoFuncao = 'ADMINISTRATIVO/EXCLUIR COLETOR BALANÇO';
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: JSON.stringify(data),
                        IP: ipUsuario
                    }

                    const responsePost = await post('/log-web', postData)


                    return response.data;
                }
            })
        } catch (error) {
            let textoFuncao = 'ADMINISTRATIVO/ERRO AO EXCLUIR COLETOR BALANÇO';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: JSON.stringify(data),
                IP: ipUsuario
            }

            const responsePost = post('/log-web', postData)


            Swal.fire({
                title: 'Erro',
                text: 'Não foi possível excluir o coletor.',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao excluir coletor:', error);
            return responsePost.data;

        }
    }

    return {
        handleClickExcluir
    }
}
