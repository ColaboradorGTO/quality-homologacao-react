import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { useQuery } from "react-query"
import { post, put } from "../../../../../api/funcRequest"
import { useFetchData } from "../../../../../hooks/useFetchData"


export const useEditarFornecedor = ({dadosDetalheFornecedor}) => {
    const [cnpj, setCnpj] = useState('');
    const [inscricaoEstadual, setInscricaoEstadual] = useState('');
    const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [numeroIBGE, setNumeroIBGE] = useState('');
    const [nomeRepresentante, setNomeRepresentante] = useState('');
    const [email, setEmail] = useState('');
    const [telefone1, setTelefone1] = useState('');
    const [telefone2, setTelefone2] = useState('');
    const [telefone3, setTelefone3] = useState('');
    const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
    const [fiscal, setFiscal] = useState('');
    const [enviar, setEnviar] = useState('');
    const [condicaoPagamento, setCondicaoPagamento] = useState('');
    const [tipoPedido, setTipoPedido] = useState('');
    const [vendedor, setVendedor] = useState('');
    const [emailVendedor, setEmailVendedor] = useState('');
    const [transportadora, setTransportadora] = useState('');
    const [tipoFrete, setTipoFrete] = useState('');
    const [data, setData] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');

    const navigate = useNavigate();
        useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setData(dataAtual)
    },[])

    
    const optionsSituacao = [
        { value: 'True', label: 'Ativo' },
        { value: 'False', label: 'Inativo' },
      ]
    
      const optionsFrete = [
        { value: 'PAGO', label: 'PAGO - CIF' },
        { value: 'APAGAR', label: 'A PAGAR - FOB' },
      ]
    
      const optionsPedido = [
        { value: 'VESTUARIO', label: 'VESTUARIO' },
        { value: 'CALCADOS', label: 'CALÇADOS' },
        { value: 'ARTIGOS', label: 'ARTIGOS' },
      ]
    
      const optionsEnviar = [
        {value: 'NE', label: 'NÃO ENVIAR'},
        {value: 'ET', label: 'ETIQUETA'},
        {value: 'AR', label: 'ARQUIVO'},
      ]
    
      const optionsFiscal = [
        {value: 'S', label: 'Simples Nacional'},
        {value: 'N', label: 'Lucro Presumido'},
        {value: 'R', label: 'Lucro Real'},
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

     const { data: dadosTransportadora = [], error: errorTransportadora, isLoading: isLoadingTransportadora } = useFetchData('/transportadoras', '/transportadoras');
     const { data: dadosCondicoesPagamento = [], error: errorPagamento, isLoading: isLoadingPagamento } = useFetchData('/condicaoPagamento', '/condicaoPagamento');
     
    useEffect(() => {
        setCnpj(dadosDetalheFornecedor[0]?.NUCNPJ)
        setInscricaoEstadual(dadosDetalheFornecedor[0]?.NUINSCESTADUAL)
        setInscricaoMunicipal(dadosDetalheFornecedor[0]?.NUINSCMUNICIPAL)
        setRazaoSocial(dadosDetalheFornecedor[0]?.NORAZAOSOCIAL)
        setNomeFantasia(dadosDetalheFornecedor[0]?.NOFANTASIA)
        setCep(dadosDetalheFornecedor[0]?.NUCEP)
        setEndereco(dadosDetalheFornecedor[0]?.EENDERECO)
        setNumero(dadosDetalheFornecedor[0]?.ENUMERO)
        setComplemento(dadosDetalheFornecedor[0]?.ECOMPLEMENTO)
        setBairro(dadosDetalheFornecedor[0]?.EBAIRRO)
        setCidade(dadosDetalheFornecedor[0]?.ECIDADE)
        setUf(dadosDetalheFornecedor[0]?.SGUF)
        setNumeroIBGE(dadosDetalheFornecedor[0]?.NUIBGE)
        setNomeRepresentante(dadosDetalheFornecedor[0]?.NOREPRESENTANTE)
        setEmail(dadosDetalheFornecedor[0]?.EEMAIL)
        setTelefone1(dadosDetalheFornecedor[0]?.NUTELEFONE1)
        setTelefone2(dadosDetalheFornecedor[0]?.NUTELEFONE2)
        setTelefone3(dadosDetalheFornecedor[0]?.NUTELEFONE3)
        setSituacaoSelecionada({value: dadosDetalheFornecedor[0]?.STATIVO, label: dadosDetalheFornecedor[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setFiscal({value: dadosDetalheFornecedor[0]?.TPFISCALPADRAO, label: dadosDetalheFornecedor[0]?.TPFISCALPADRAO == 'S' ? 'Simples Nacional' : dadosDetalheFornecedor[0]?.TPFISCALPADRAO == 'N' ? 'Lucro Presumido' : 'Lucro Real'})
        setEnviar({value: dadosDetalheFornecedor[0]?.TPARQUIVOPADRAO, label: dadosDetalheFornecedor[0]?.TPARQUIVOPADRAO == 'NE' ? 'NÃO ENVIAR' : dadosDetalheFornecedor[0]?.TPARQUIVOPADRAO == 'ET' ? 'ETIQUETA' : 'ARQUIVO'})
        setCondicaoPagamento({value: dadosDetalheFornecedor[0]?.IDCONDICAOPAGAMENTO, label: dadosDetalheFornecedor[0]?.DSCONDICAOPAG})
        setTipoPedido({value: dadosDetalheFornecedor[0]?.TPPEDIDOPADRAO, label: dadosDetalheFornecedor[0]?.TPPEDIDOPADRAO == 'VESTUARIO' ? 'VESTUARIO' : dadosDetalheFornecedor[0]?.TPPEDIDOPADRAO == 'CALCADOS' ? 'CALÇADOS' : dadosDetalheFornecedor[0]?.TPPEDIDOPADRAO == 'ARTIGOS' ? 'ARTIGOS' : ''})
        setVendedor(dadosDetalheFornecedor[0]?.NOVENDEDORPADRAO)
        setEmailVendedor(dadosDetalheFornecedor[0]?.EMAILVENDEDORPADRAO)
        setTransportadora({value: dadosDetalheFornecedor[0]?.IDTRANSPORTADORA, label: dadosDetalheFornecedor[0]?.NOMETRANSPORTADORA})
        setTipoFrete({value: dadosDetalheFornecedor[0]?.TPFRETEPADRAO, label: dadosDetalheFornecedor[0]?.TPFRETEPADRAO == 'PAGO' ? 'PAGO - CIF' : 'A PAGAR - FOB'})
    }, [dadosDetalheFornecedor])

 

    const handleEditar = async () => {
        if (cnpj == '' || cnpj.length < 11 || cnpj.length !== 14) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `CNPJ ou CPF Incompleto, Faltam ${cnpj.length > 11 ? "${14 - cnpj.length}" : "${11 - cnpj.length}"} Dígito(s)!`,
                text: `Favor Verificar o CNPJ!`,
                type: 'warning',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(razaoSocial == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a Razão Social do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(nomeFantasia == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Nome Fantasia do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(endereco == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Endereço do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(numero == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Número do Endereço do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(bairro == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Bairro do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(cidade == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a Cidade do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(uf == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a UF do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(cep == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o CEP do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(condicaoPagamento == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a Condição de Pagamento do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(transportadora == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a Transportadora do Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(nomeRepresentante == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Nome do Representante deste Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(telefone1 == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Telefone do Representante deste Fornecedor.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        const postData = [{
            IDFORNECEDOR: dadosDetalheFornecedor[0]?.IDFORNECEDOR,
            IDGRUPOEMPRESARIAL: dadosDetalheFornecedor[0]?.IDGRUPOEMPRESARIAL,
            IDSUBGRUPOEMPRESARIAL: dadosDetalheFornecedor[0]?.IDSUBGRUPOEMPRESARIAL,
            MODPEDIDO: dadosDetalheFornecedor[0]?.MODPEDIDO,
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
            STATIVO: situacaoSelecionada.value,
            IDCONDPAGPADRAO: condicaoPagamento.value,
            IDTRANSPORTADORAPADRAO: transportadora.value,
            TPPEDIDOPADRAO: tipoPedido.value,
            NOVENDEDORPADRAO: vendedor,
            TPFRETEPADRAO: tipoFrete.value,
            TPARQUIVOPADRAO: enviar.value,
            TPFISCALPADRAO: fiscal.value,
            EMAILVENDEDORPADRAO: emailVendedor,
        }]
        try {

            const response = await put('/transportador/:id', postData)

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
            let textFuncao = 'COMPRAS/CADASTRO-EDIÇÃO DE FORNECEDOR';

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
        situacaoSelecionada,
        setSituacaoSelecionada,
        fiscal,
        setFiscal,
        enviar,
        setEnviar,
        condicaoPagamento,
        setCondicaoPagamento,
        tipoPedido,
        setTipoPedido,
        vendedor,
        setVendedor,
        emailVendedor,
        setEmailVendedor,
        transportadora,
        setTransportadora,
        tipoFrete,
        setTipoFrete,
        optionsSituacao,
        optionsFrete,
        optionsPedido,
        optionsEnviar,
        optionsFiscal,
        dadosTransportadora,
        dadosCondicoesPagamento,
        handleEditar,
    }
}