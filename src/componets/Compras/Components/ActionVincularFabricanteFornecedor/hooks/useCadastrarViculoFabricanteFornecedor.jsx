import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDataHoraAtual } from "../../../../../utils/dataAtual";
import { useFetchData } from "../../../../../hooks/useFetchData";
import { toFloat } from "../../../../../utils/toFloat";

export const useCadastrarVinculoFabricanteFornecedor = () => {
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [fabricanteSelecionado, setFabricanteSelecionado] = useState('')
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
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

    const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes } = useFetchData('fabricantes', '/fabricantes');
 

    const handleCadastrar = async () => {
        if (fornecedorSelecionado === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `O Fornecedor deve ser Informado!.`,
                type: 'warning',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if (fabricanteSelecionado === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `O Fabricante deve ser Informado!`,
                type: 'warning',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }


        const postData = [{
            IDFABRICANTE: toFloat(fabricanteSelecionado.value),
            IDFORNECEDOR: toFloat(fornecedorSelecionado.value),
            STATIVO: 'True',
        }]
        try {

            const response = await post('/cadastro-fabricantes', postData)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cadastro com sucesso!',
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
        fabricanteSelecionado,
        fornecedorSelecionado,
        setFabricanteSelecionado,
        setFornecedorSelecionado,
        data,
        optionsStatus,
        setStatusSelecionado,
        dadosFabricantes,
        handleCadastrar
    }
}