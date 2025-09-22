import Swal from "sweetalert2"
import { get, post } from "../../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getDataAtual } from "../../../../../../utils/dataAtual"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const useCadastrarCampanha = () => {
    const [descricao, setDescricao] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [marcaSelecionada, setMarcaSelecionada] = useState('')
    const [empresaSelecionada, setEmpresaSelecionada] = useState('')
    const [percentDesconto, setPercentDesconto] = useState(0)
    const [ipUsuario, setIpUsuario] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState(null);

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


    useEffect(() => {
        const dataInicial = getDataAtual()
        const dataFinal = getDataAtual()
        setDataInicio(dataInicial)
        setDataFim(dataFinal)

    }, [])

    const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
        'marcasLista',
        async () => {
            const response = await get(`/marcasLista`);
            return response.data;
        },
        { staleTime: 5 * 60 * 1000 }
    );

    const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
        ['listaEmpresaComercial', marcaSelecionada],
        async () => {
            if (marcaSelecionada) {
                const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
                return response.data;
            } else {
                return [];
            }
        },
        { enabled: false, staleTime: 5 * 60 * 1000 }
    );


    useEffect(() => {
        if (marcaSelecionada) {
            refetchEmpresas();
        }
        refetchMarcas()
    }, [marcaSelecionada, refetchEmpresas]);



    const onSubmit = async (data) => {
        if (!descricao || !percentDesconto || !empresaSelecionada) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Preencha os campos! Descrição e Desconto e Empresa são obrigatórios!`,
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        const postData = [{
            DSCAMPANHA: descricao,
            IDOPERADOR: usuarioLogado.id,
            DTINICIO: dataInicio,
            DTFINAL: dataFim,
            VRPERCDESCONTO: parseFloat(percentDesconto),
            EMPRESAS: empresaSelecionada,
        }];

        try {
            const response = await post('/cadastra-campanha', postData);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cadastro realizado com sucesso!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });

            const textDados = JSON.stringify(postData);
            let textoFuncao = 'MARKETING/CADASTRO DE CLIENTE';

            const createData = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };

            const responsePost = await post('/log-web', createData);
            // handleClose();
            return responsePost.data;
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao Cadastrar Cleinte!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });
            console.log(error);
        }
    };

    return {
        descricao,
        setDescricao,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        marcaSelecionada,
        setMarcaSelecionada,
        empresaSelecionada,
        setEmpresaSelecionada,
        percentDesconto,
        setPercentDesconto,
        optionsMarcas,
        optionsEmpresas,
        onSubmit
    };
}