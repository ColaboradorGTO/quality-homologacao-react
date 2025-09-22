import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import Swal from "sweetalert2"
import { post } from "../../../api/funcRequest"
import { useFetchData } from "../../../hooks/useFetchData"
import { getDataAtual } from "../../../utils/dataAtual"
import { set } from "date-fns"

export const useCadastrarCondicaoPagamento = ({}) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [descricao, setDescricao] = useState('')
    const [parceladoSelecionado, setParceladoSelecionado] = useState('')
    const [numeroParcelas, setNumeroParcelas] = useState('')
    const [dias1Pagamento, setDias1Pagamento] = useState('')
    const [qtdDiasPagamento, setQtdDiasPagamento] = useState('')
    const [tipoDocumentoSelecionado, setTipoDocumentoSelecionado] = useState('')
    const [condPagamento, setCondPagamento] = useState('')
    const [dataUltimaAlteracao, setDataUltimaAlteracao] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

      const { data: dadosTipoDocumentos = [], error: errorDocumento, isLoading: isLoadingDocumento } = useFetchData('tipoDocumento', '/tipoDocumento');
  
    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]
    const optionsParcelado = [
        { value: 'True', label: 'SIM' },
        { value: 'False', label: 'NAO' }
    ]

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataUltimaAlteracao(dataAtual);
    })

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

    const cadastrar = async () => {
        if (descricao == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const diasParcelas = [];
        
        for(let i = 1; i < numeroParcelas; i++) {
            if (i == 1) {
                diasParcelas[i] = toFloat(dias1Pagamento) + toFloat(qtdDiasPagamento);
            } else {
                diasParcelas[i] = diasParcelas[i - 1] + toFloat(qtdDiasPagamento);
            }
        }

        const postData = [{
       
            IDGRUPOEMPRESARIAL: 1,
            DSCONDICAOPAG: descricao,
            STPARCELADO: parceladoSelecionado.value,
            NUPARCELAS: toFloat(numeroParcelas),
            NUNDIA1PAG: toFloat(dias1Pagamento),
            NUNDIA2PAG: diasParcelas[1] || 0,
            NUNDIA3PAG: diasParcelas[2] || 0,
            NUNDIA4PAG: diasParcelas[3] || 0,
            NUNDIA5PAG: diasParcelas[4] || 0,
            NUNDIA6PAG: diasParcelas[5] || 0,
            NUNDIA7PAG: diasParcelas[6] || 0,
            NUNDIA8PAG: diasParcelas[7] || 0,
            NUNDIA9PAG: diasParcelas[8] || 0,
            NUNDIA10PAG: diasParcelas[9] || 0,
            NUNDIA11PAG: diasParcelas[10] || 0,
            NUNDIA12PAG: diasParcelas[11] || 0,
            IDTPDOCUMENTO: toFloat(tipoDocumentoSelecionado.value),
            DTULTALTERACAO: dataUltimaAlteracao,
            STATIVO: statusSelecionado.value,
            QTDDIAS: toFloat(qtdDiasPagamento),
        }]
        try {

            const response = await post('/cadastrarCondicaoPagamento', postData)

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
            let textFuncao = 'COMPRAS/CADASTRO DE CONDIÇÕES DE PAGAMENTO';

            const createtLog = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)
            setStatusSelecionado('');
            setDescricao('');
            setParceladoSelecionado('');
            setNumeroParcelas('');
            setDias1Pagamento('');
            setQtdDiasPagamento('');
            setTipoDocumentoSelecionado('');

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
        descricao,
        setDescricao,
        parceladoSelecionado,
        setParceladoSelecionado,
        numeroParcelas,
        setNumeroParcelas,
        dias1Pagamento,
        setDias1Pagamento,
        qtdDiasPagamento,
        setQtdDiasPagamento,
        tipoDocumentoSelecionado,
        setTipoDocumentoSelecionado,
        condPagamento,
        setCondPagamento,
        usuarioLogado,
        ipUsuario,
        optionsStatus,
        optionsParcelado,
        dadosTipoDocumentos,
        cadastrar,
    }
}