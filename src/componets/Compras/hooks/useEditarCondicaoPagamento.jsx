import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import Swal from "sweetalert2"
import { post, put } from "../../../api/funcRequest"
import { useFetchData } from "../../../hooks/useFetchData"
import { toFloat } from "../../../utils/toFloat"
import { getDataHoraAtual } from "../../../utils/dataAtual"

export const useEditarCondicaoPagamento = ({dadosDetalheCondPagamento}) => {
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

    useEffect(() => {
        const dataAtual = getDataHoraAtual();
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

    useEffect(() => {
        if (dadosDetalheCondPagamento) {
            setStatusSelecionado({ value: dadosDetalheCondPagamento[0]?.STATIVO, label: dadosDetalheCondPagamento[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' });
            setDescricao(dadosDetalheCondPagamento[0]?.DSCONDICAOPAG);
            setParceladoSelecionado({value: dadosDetalheCondPagamento[0]?.STPARCELADO, label: dadosDetalheCondPagamento[0]?.STPARCELADO == 'True' ? 'SIM' : 'NÃO'});
            setNumeroParcelas(toFloat(dadosDetalheCondPagamento[0]?.NUPARCELAS));
            setDias1Pagamento(dadosDetalheCondPagamento[0]?.NUNDIA1PAG);
            setQtdDiasPagamento(dadosDetalheCondPagamento[0]?.QTDDIAS);
            setTipoDocumentoSelecionado({value: dadosDetalheCondPagamento.IDTPDOCUMENTO , label: `${dadosDetalheCondPagamento[0]?.IDTPDOCUMENTO} - ${dadosDetalheCondPagamento[0]?.DSTPDOCUMENTO}`});
           
        }
    }, [dadosDetalheCondPagamento])

    const handleEditar = async () => {
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

        // for (var i = 1; i < numeroParcelas; i++) {

        //     if (i == 1) {
        //       var NUNDIA2PAG = parseFloat(dias1Pagamento) + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 2) {
        //       var NUNDIA3PAG = NUNDIA2PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 3) {
        //       var NUNDIA4PAG = NUNDIA3PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 4) {
        //       var NUNDIA5PAG = NUNDIA4PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 5) {
        //       var NUNDIA6PAG = NUNDIA5PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 6) {
        //       var NUNDIA7PAG = NUNDIA6PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 7) {
        //       var NUNDIA8PAG = NUNDIA7PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 8) {
        //       var NUNDIA9PAG = NUNDIA8PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 9) {
        //       var NUNDIA10PAG = NUNDIA9PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 10) {
        //       var NUNDIA11PAG = NUNDIA10PAG + parseFloat(qtdDiasPagamento);
        //     }
        //     if (i == 11) {
        //       var NUNDIA12PAG = NUNDIA11PAG + parseFloat(qtdDiasPagamento);
        //     }
        
        // }

        const postData = [{
            IDCONDICAOPAGAMENTO: toFloat(dadosDetalheCondPagamento[0]?.IDCONDICAOPAGAMENTO),
            IDGRUPOEMPRESARIAL: toFloat(dadosDetalheCondPagamento[0]?.IDGRUPOEMPRESARIAL),
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

            const response = await put('/condicaoPagamento/:id', postData)

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
            let textFuncao = 'COMPRAS/CADASTRO DE CATEGORIA DE PEDIDO';

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
        dadosTipoDocumentos,
        handleEditar
    }
}