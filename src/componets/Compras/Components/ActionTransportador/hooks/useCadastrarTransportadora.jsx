import { useEffect, useState } from "react"
import { post, put } from "../../../api/funcRequest"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { get } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"


export const useCadastrarTransportadora = ({}) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [inscricaoEstadual, setInscricaoEstadual] = useState('')
    const [inscricaoMunicipal, setInscricaoMunicipal] = useState('')
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [cep, setCep] = useState('')
    const [endereco, setEndereco] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const [numeroIBGE, setNumeroIBGE] = useState('')
    const [nomeRepresentante, setNomeRepresentante] = useState('')
    const [email, setEmail] = useState('')
    const [telefone1, setTelefone1] = useState('')
    const [telefone2, setTelefone2] = useState('')
    const [telefone3, setTelefone3] = useState('')
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

    const optionsTipoCategoria = [
        { value: 'VESTUARIO', label: 'VESTUARIO' },
        { value: 'CALCADOS', label: 'CALCADOS' },
        { value: 'ARTIGOS', label: 'ARTIGOS' },
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

    

    const { data: dadosCNPJ = [], error: errorCNPJ, isLoading: isLoadingCNPJ } = useQuery(
        ['listaTransportador', cnpj],
        async () => {
            const response = await get(`/listaTransportador?cnpjTransportador=${cnpj}`);
            return response.data;
        },
        { enabled: cnpj.length === 14, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000}
    );


    useEffect(() => {
        if (dadosCNPJ && cnpj.length > 0) {
            Swal.fire({
            title: 'CNPJ Inválido!',
            text: `Favor Digitar um CNPJ Válido!`,
            icon: 'warning',
            confirmButtonText: 'Ok',
            customClass: {
                container: 'custom-swal',
            }
            });
        }
    }, [dadosCNPJ]);

    const handleCadastrar = async () => {
        if (cnpj == '' || cnpj.length < 14) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `CNPJ Incompleto, Faltam "${14 - cnpj.length}" Dígito(s)!`,
                text: `Favor Verificar o CNPJ!`,
                type: 'warning',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(razaoSocial == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Razão Social não pode ser vazia!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(nomeFantasia == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Nome Fantasia do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(endereco == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Endereço do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(numero == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Número do Endereço do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(bairro == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Bairro do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(cidade == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a Cidade do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(uf == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Estado do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(cep == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o CEP do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const postData = [{
            // IDTRANSPORTADORA: dadosDetalheTranspotador[0]?.IDTRANSPORTADORA,
            // IDGRUPOEMPRESARIAL: dadosDetalheTranspotador[0]?.IDGRUPOEMPRESARIAL,
            // IDSUBGRUPOEMPRESARIAL: dadosDetalheTranspotador[0]?.IDSUBGRUPOEMPRESARIAL,
            NORAZAOSOCIAL: razaoSocial,
            NOFANTASIA: nomeFantasia,
            NUCNPJ: cnpj,
            NUINSCESTADUAL: inscricaoEstadual,
            NUINSCMUNICIPAL: inscricaoMunicipal,
            NUIBGE: numeroIBGE,
            EENDERECO: endereco,
            ENUMERO: numero,
            ECOMPLEMENTO: complemento,
            EBAIRRO: bairro,
            ECIDADE: cidade,
            SGUF: uf,
            NUCEP: cep,
            EEMAIL: email,
            NUTELEFONE1: telefone1,
            NUTELEFONE2: telefone2,
            NUTELEFONE3: telefone3,
            NOREPRESENTANTE: nomeRepresentante,
            DTCADASTRO: data,
            DTULTATUALIZACAO: data,
            STATIVO: statusSelecionado,
        }]
        try {

            const response = await post('/cadastrar-transportador', postData)

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
            let textFuncao = 'COMPRAS/CADASTRO-EDIÇÃO DE TRANSPORTADORA';

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
        setStatusSelecionado,
        cnpj,
        setCnpj,
        inscricaoEstadual,
        setInscricaoEstadual,
        inscricaoMunicipal,
        setInscricaoMunicipal,
        razaoSocial,
        setRazaoSocial,
        nomeFantasia,
        setNomeFantasia,
        cep,
        setCep,
        endereco,
        setEndereco,
        numero,
        setNumero,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        uf,
        setUf,
        numeroIBGE,
        setNumeroIBGE,
        nomeRepresentante,
        setNomeRepresentante,
        email,
        setEmail,
        telefone1,
        setTelefone1,
        telefone2,
        setTelefone2,
        telefone3,
        setTelefone3,
        data,
        setData,
        optionsStatus,
        optionsTipoCategoria,
        handleCadastrar,
    }
}