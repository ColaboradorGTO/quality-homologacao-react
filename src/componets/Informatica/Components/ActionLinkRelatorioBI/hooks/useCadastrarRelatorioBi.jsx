import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCadastrarRelatorioBi = () => {
    const [linkRelatorioBI, setLinkRelatorioBI] = useState('');
    const [empresaSelecionada, setEmpresaSelecionada] = useState([])
    const [relatorioSelecionado, setRelatorioSelecionado] = useState([])
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioArmazenado = localStorage.getItem('usuario');

        if (usuarioArmazenado) {
            try {
                const parsedUsuario = JSON.parse(usuarioArmazenado);
                setUsuarioLogado(parsedUsuario);
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
        const response = await axios.get('http://ipwho.is/');
        if (response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    };



    const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresa } = useQuery(
        'listaEmpresasIformatica',
        async () => {
            const response = await get(`/listaEmpresasIformatica`);
            return response.data;
        },
        {
            staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
        }
    );

    const { data: dadosBI = [], error: errorListaBI, isLoading: isLoadingBI, refetch } = useQuery(
        'relatorioInformaticaBI?status=True',
        async () => {
            const response = await get(`/relatorioInformaticaBI?status=True`);
            return response.data;
        },
        {
            staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
        }
    );

    const onSubmit = async (data) => {
        if (!empresaSelecionada || !relatorioSelecionado || !statusSelecionado || !linkRelatorioBI) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Preencha todos os campos!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const postData = {
            IDRELATORIOBI: relatorioSelecionado,
            IDEMPRESA: empresaSelecionada,
            LINK: linkRelatorioBI,
            STATIVO: statusSelecionado,

        }

        try {
            const response = await post('/criarlinkRelatorioBI', postData)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Relatório atualizado com sucesso!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500
            })

            let textDados = JSON.stringify(postData);
            let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';

            const createData = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };

            const responsePost = await post('/log-web', createData);

            return responsePost.data;


        } catch (error) {
            let textoFuncao = 'INFORMATICA/ERRO AO ATUALIZAR LINK RELATORIO BI';

            const createData = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };

            const responsePost = await post('/log-web', createData);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao atualizar Relatório!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });

            return responsePost.data;
        }


    }


    const optionsStatus = [
        { value: "True", label: "Ativo" },
        { value: "False", label: "Inativo" },
    ]

    return {
        linkRelatorioBI,
        setLinkRelatorioBI,
        empresaSelecionada,
        setEmpresaSelecionada,
        relatorioSelecionado,
        setRelatorioSelecionado,
        statusSelecionado,
        setStatusSelecionado,
        usuarioLogado,
        ipUsuario,
        dadosEmpresas,
        errorEmpresas,
        isLoadingEmpresas,
        refetchEmpresa,
        dadosBI,
        errorListaBI,
        isLoadingBI,
        refetch,
        onSubmit,
        optionsStatus
    };
}