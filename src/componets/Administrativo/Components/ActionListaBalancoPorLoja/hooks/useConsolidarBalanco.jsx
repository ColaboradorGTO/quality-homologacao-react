import Swal from "sweetalert2"
import { put, post, get } from "../../../../../api/funcRequest"
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";

export const useConsolidarBalanco = ({ 
    optionsModulos, 
    usuarioLogado, 
    dadosBalanco,
    handleClose,
    handleClickResumoBalanco 
}) => {
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

  
    
    const { data: dadosBalancoConsolidado = [], error: error, isLoading: isLoading, refetch: refetchConsolidado } = useQuery(
        'consolidar-balanco',
        async () => {
          const response = await get(`/consolidar-balanco?idResumo=${dadosBalanco[0]?.IDRESUMOBALANCO}`);
          return response.data;
        },
        { enabled: false, staleTime: 60 * 60 * 1000, }
    );

    const handleConsolidar = async () => {
        const putData = {
            IDRESUMOBALANCO: Number(dadosBalanco[0]?.IDRESUMOBALANCO),
            IDEMPRESA: Number(dadosBalanco[0]?.IDEMPRESA),
        }

        try {

            const response = await put('/consolidar-balanco/:id', putData)


            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTRATIVO/CONSOLIDAR BALANCO';


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
            refetchConsolidado();
            return responsePost.data;

        } catch (error) {
            let textoFuncao = 'ADMINISTRATIVO/ERRO AO CONSOLIDAR BALANCO';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: 'ERRO AO CONSOLIDAR BALANCO',
                IP: ipUsuario
            }
            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Atualizar!',
                text: 'Erro ao Atualizar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao Tentar Consolidar o Balanço: ', error);
            return responsePost.data;
        }
    }

    return {
        dadosBalancoConsolidado,
        handleConsolidar
    }
}