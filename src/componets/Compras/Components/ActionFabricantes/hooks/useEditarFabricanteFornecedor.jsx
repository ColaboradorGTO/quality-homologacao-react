import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDataHoraAtual } from "../../../../../utils/dataAtual";

export const useEditarFabricanteFornecedor = ({dadosDetalheFabricante}) => {
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [fabricante, setFabricante] = useState('')
    const [data, setData] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setData(dataAtual)
    },[])

    
    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]

    useEffect(() => {
        const usuarioArmazenado = localStorage.getItem('usuario');

        if (usuarioArmazenado) {
            try {
                const parsedUsuario = JSON.parse(usuarioArmazenado);
                setUsuarioLogado(parsedUsuario);;
            } catch (error) {
                console.error('Erro ao parsear o usuário do localStorage:', error);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

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

    useEffect(() => {
        setStatusSelecionado({value: dadosDetalheFabricante[0]?.STATIVO, label: dadosDetalheFabricante[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setFabricante(dadosDetalheFabricante[0]?.DSFABRICANTE)

    }, [dadosDetalheFabricante])

 

    const handleEditar = async () => {
        if (fabricante === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Informe o NOME do Fabricante.`,
                type: 'warning',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }


        const postData = [{
            IDFABRICANTE: dadosDetalheFabricante[0]?.IDFABRICANTE,
            DSFABRICANTE: fabricante,
            DTULTATUALIZACAO: data,
            STATIVO: statusSelecionado.value,
        }]
        try {

            const response = await put('/fabricante-fornecedor/:id', postData)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO DE FABRICANTE';

            const createtLog = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)


            return responseLog.data;
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao criar categoria pedido:', error);
        }
    }

    return {
        statusSelecionado,
        fabricante,
        data,
        optionsStatus,
        setStatusSelecionado,
        setFabricante,
        handleEditar,
    }
}