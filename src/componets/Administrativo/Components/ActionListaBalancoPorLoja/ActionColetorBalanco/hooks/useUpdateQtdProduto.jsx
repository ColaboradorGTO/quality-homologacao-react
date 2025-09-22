import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2"
import axios from "axios";
import { post, put } from "../../../../../../api/funcRequest";


export const useUpdateQTDProduto = ({ optionsModulos, usuarioLogado }) => {
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

    const onSubmit = async (IDDETALHEBALANCO, TOTALCONTAGEMGERAL) => {
        console.log(IDDETALHEBALANCO, TOTALCONTAGEMGERAL, 'chegou')
        const putData = {
            IDDETALHEBALANCO: IDDETALHEBALANCO,
            TOTALCONTAGEMGERAL: TOTALCONTAGEMGERAL,
        }

        try {
            const response = await put('/detalhe-balanco/:id', putData)

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMNISTRATIVO/ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                title: 'Atualizado com Sucesso!',
                text: 'Atualizado com Sucesso',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })

            return responsePost.data;
        } catch (error) {
            let textoFuncao = 'ADMNISTRATIVO/ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: 'ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO',
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Alterar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return responsePost.data;
        }
    }

    const onSubmitExcluir = async (IDDETALHEBALANCO, TOTALCONTAGEMGERAL) => {

        const putData = {
            IDDETALHEBALANCO: IDDETALHEBALANCO,
            TOTALCONTAGEMGERAL: 0,
        }

        try {
            const response = await put('/detalhe-balanco/:id', putData)

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMNISTRATIVO/ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                title: 'Atualizado com Sucesso!',
                text: 'Atualizado com Sucesso',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })

            return responsePost.data;
        } catch (error) {
            let textoFuncao = 'ADMNISTRATIVO/ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: 'ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO',
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Alterar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return responsePost.data;
        }
    }

    return {
        onSubmit,
        onSubmitExcluir
    }
}
