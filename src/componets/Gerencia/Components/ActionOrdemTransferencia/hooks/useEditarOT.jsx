import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";

export const useEditarOT = ({
  dadosDetalheTransferencia,
  handleClick,
  handleClose,
  optionsModulos,
  usuarioLogado
}) => {
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [dataCadastro, setDataCadastro] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [linhaSelecionada, setLinhaSelecionada] = useState(null)
  const [ipUsuario, setIpUsuario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ipwho.is:", error);
    }

    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };


  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataCadastro(dataAtual);

    if (dadosDetalheTransferencia && dadosDetalheTransferencia.length > 0) {
      setEmpresaOrigem(dadosDetalheTransferencia[0]?.IDEMPRESAORIGEM);
      setEmpresaDestino(dadosDetalheTransferencia[0]?.IDEMPRESADESTINO);
    }

  }, []);

  const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: dadosProdutos = [], error: errorProduto, isLoading: isLoadingProduto } = useQuery(
    ['funcionarios-loja', produto],
    async () => {
      const response = await get(`/listaProdutos?idEmpresa=${usuarioLogado?.IDEMPRESA}&dsProduto=${produto}`);
      return response.data;
    },
    { enabled: produto.length > 4, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );



  const onSubmit = async () => {
    if (dadosProdutos.length > 200) {
      Swal.fire({
        title: 'Atenção!',
        icon: 'warning',
        text: 'A OT não pode conter mais de 200 tipos de produtos!',
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const dadosdetalheot = dadosDetalheTransferencia.map((item) => ({
      IDPRODUTO: item.IDPRODUTO,
      QTDEXPEDICAO: item.QTDEXPEDICAO,
      QTDRECEPCAO: 0,
      QTDDIFERENCA: 0,
      QTDAJUSTE: 0,
      VLRUNITVENDA: item.VLRUNITVENDA,
      VLRUNITCUSTO: item.VLRUNITCUSTO,
      STCONFERIDO: 'False',
      IDUSRAJUSTE: 0,
      STATIVO: 'True',
      STFALTA: 'False',
      STSOBRA: 'False',
    }));

    const nCtTotalItens = dadosdetalheot.length;
    const nQtdTotalItens = dadosdetalheot.reduce((acc, item) => acc + item.QTDEXPEDICAO, 0);
    const dVlrTotalVenda = dadosdetalheot.reduce((acc, item) => acc + (item.QTDEXPEDICAO * item.VLRUNITVENDA), 0);
    const dVlrTotalCusto = dadosdetalheot.reduce((acc, item) => acc + (item.QTDEXPEDICAO * item.VLRUNITCUSTO), 0);

    const postData = {
      IDRESUMOOT: dadosDetalheTransferencia[0]?.IDRESUMOOT,
      IDEMPRESAORIGEM: dadosDetalheTransferencia[0]?.IDEMPRESAORIGEM,
      IDEMPRESADESTINO: dadosDetalheTransferencia[0]?.IDEMPRESADESTINO,
      IDOPERADOREXPEDICAO: usuarioLogado?.id,
      NUTOTALITENS: nCtTotalItens,
      QTDTOTALITENS: nQtdTotalItens,
      QTDTOTALITENSRECEPCIONADO: 0,
      QTDTOTALITENSDIVERGENCIA: 0,
      NUTOTALVOLUMES: 0,
      TPVOLUME: "",
      VRTOTALCUSTO: dVlrTotalCusto,
      VRTOTALVENDA: dVlrTotalVenda,
      DTRECEPCAO: "",
      IDOPERADORRECEPTOR: 0,
      DSOBSERVACAO: "",
      IDUSRCANCELAMENTO: 0,
      IDSTDIVERGENCIA: 0,
      OBSDIVERGENCIA: "",
      STEMISSAONFE: "False",
      NUMERONFE: "",
      STENTRADAINVENTARIO: "False",
      QTDCONFERENCIA: 0,
      IDSTATUSOT: parseInt(1),
      IDUSRAJUSTE: 0,
      DTAJUSTE: "",
      QTDTOTALITENSAJUSTE: 0,
      dadosdetalheot: dadosdetalheot,
      DATAEXPEDICAO: "",
      DTULTALTERACAO: "",
    };

    try {

      const response = await put('/resumo-ordem-transferencia/:id', postData);

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'GERENCIA/EDIÇÃO OT';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'OT Alterada com Sucesso',
        icon: 'success'
      });

      handleClick();
      handleClose();
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'GERENCIA/ERRO AO EDITAR OT';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      const responsePost = await post('/log-web', createData)


      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao alterar os dados da OT!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      handleClose();
      return responsePost.data;
    }
  };

  return {
    empresaOrigem,
    setEmpresaOrigem,
    empresaDestino,
    setEmpresaDestino,
    produto,
    setProduto,
    dataEntrega,
    setDataEntrega,
    quantidade,
    setQuantidade,
    observacao,
    setObservacao,
    linhaSelecionada,
    setLinhaSelecionada,
    dadosEmpresa,
    dadosProdutos,
    onSubmit,
  };
};

