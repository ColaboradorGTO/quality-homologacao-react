import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { toFloat } from "../../../../../utils/toFloat";

export const useSalvarOT = ({handleClick, handleClose, optionsModulos, usuarioLogado}) => {
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const [dadosProdutosTabela, setDadosProdutosTabela] = useState([]);
  const [produtoSalvo, setProdutoSalvo] = useState([]);

  const getIPUsuario = async () => {
    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      let usuarioIP = ipWhoisData?.ip;

      if (!usuarioIP) {
          const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
          usuarioIP = ipifyData?.ip;
      }

      setIpUsuario(usuarioIP);
      return usuarioIP;
    } catch (error) {
      console.error("Erro ao buscar IP:", error);
      return null;
    }
  };


  const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  
  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchProdutos } = useQuery(
    ['listaProdutos', produto, usuarioLogado?.IDEMPRESA],
    async () => {

      const response = await get(`/listaProdutos?idEmpresa=${usuarioLogado?.IDEMPRESA}&idProduto=${produto}&page=1 `);
      setDadosProdutosTabela(prev => {
        const novosProdutos = response.data.filter(
          novo => !prev.some(prod => prod.IDPRODUTO === novo.IDPRODUTO)
        );
        return [...prev, ...novosProdutos];
      });

      return response.data;
    },
    { enabled: produto.length > 8, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );
  
  useEffect(() => {
    if (produto.length > 4 && empresaDestino <= 0) {
      Swal.fire({
        title: 'A Loja de Origem e Destino devem ser Preenchidas!',
        icon: 'info',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'custom-swal',
        }
      });
      // setProduto(""); 
      return;
    }
  }, [dadosProdutos, produto]);

  useEffect(() => {
    if (produto.length > 5) {

      refetchProdutos();
    }
  }, [dadosProdutos, produto]);

  
  const onSubmit = async () => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar a OT!`,  
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }
    try {

      var nCtTotalItens = 0;
      var nQtdTotalItens = 0;
      var dVlrTotalVenda = 0;
      var dVlrTotalCusto = 0;

      const dadosdetalheot = dadosProdutosTabela.map((item) => {
        const nQtdProduto = 1;
        const nVlrVenda = parseFloat(item.PRECOVENDA);
        const nVlrCusto = parseFloat(item.PRECOCUSTO);

        nCtTotalItens++;
        nQtdTotalItens = nQtdTotalItens + toFloat(nQtdProduto);
        dVlrTotalVenda = dVlrTotalVenda + (toFloat(nQtdProduto) * toFloat(nVlrVenda));
        dVlrTotalCusto = dVlrTotalCusto + (toFloat(nQtdProduto) * toFloat(nVlrCusto));

        return {
          IDPRODUTO: item.IDPRODUTO,
          QTDEXPEDICAO: nQtdProduto,
          QTDRECEPCAO: 0,
          QTDDIFERENCA: 0,
          QTDAJUSTE: 0,
          VLRUNITVENDA: nVlrVenda,
          VLRUNITCUSTO: nVlrCusto,
          STCONFERIDO: 'False',
          IDUSRAJUSTE: 0,
          STATIVO: 'True',
          STFALTA: 'False',
          STSOBRA: 'False'
        };
      });
   
      const postData = {
        IDRESUMOOT: parseInt(0),
        IDEMPRESAORIGEM: usuarioLogado?.IDEMPRESA,
        IDEMPRESADESTINO: parseInt(empresaDestino?.value),
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
        IDSTATUSOT: 1,
        IDUSRAJUSTE: 0,
        DTAJUSTE: "",
        QTDTOTALITENSAJUSTE: 0,
        DATAEXPEDICAO: "",
        DTULTALTERACAO: "",
        dadosdetalheot: dadosdetalheot,
      };
      const response = await post('/criar-resumo-ordem-transferencia', postData);
 
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'EXPEDICAO/OT CRIADA COM SUCESSO';
      await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };
  
      const responsePost = await post('/log-web', createData)
  
      Swal.fire({
        title: 'Cadastro',
        text: 'OT cadastrada com Sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        },
      });
  
  
      handleClose();
      handleClick();
      return responsePost.data;
    } catch (error) {
      var nCtTotalItens = 0;
      var nQtdTotalItens = 0;
      var dVlrTotalVenda = 0;
      var dVlrTotalCusto = 0;

      const dadosdetalheot = dadosProdutosTabela.map((item) => {
        const nQtdProduto = 1;
        const nVlrVenda = item.PRECOVENDA;
        const nVlrCusto = item.PRECOCUSTO;
        nCtTotalItens++;
        nQtdTotalItens = nQtdTotalItens + toFloat(nQtdProduto);
        dVlrTotalVenda = dVlrTotalVenda + (toFloat(nQtdProduto) * toFloat(nVlrVenda));
        dVlrTotalCusto = dVlrTotalCusto + (toFloat(nQtdProduto) * toFloat(nVlrCusto));

       
        return {
          IDPRODUTO: item.IDPRODUTO,
          QTDEXPEDICAO: nQtdProduto,
          QTDRECEPCAO: 0,
          QTDDIFERENCA: 0,
          QTDAJUSTE: 0,
          VLRUNITVENDA: nVlrVenda,
          VLRUNITCUSTO: nVlrCusto,
          STCONFERIDO: 'False',
          IDUSRAJUSTE: 0,
          STATIVO: 'True',
          STFALTA: 'False',
          STSOBRA: 'False'
        };
      });
      
      const postData = {
        IDEMPRESAORIGEM: usuarioLogado?.IDEMPRESA,
        IDEMPRESADESTINO: parseInt(empresaDestino),
        DATAEXPEDICAO: "",
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
        DTULTALTERACAO: "",
        IDSTDIVERGENCIA: 0,
        OBSDIVERGENCIA: "",
        STEMISSAONFE: "False",
        NUMERONFE: "",
        STENTRADAINVENTARIO: "False",
        QTDCONFERENCIA: 0,
        dadosdetalheot: dadosdetalheot,
        IDRESUMOOT: parseInt(0),
        IDSTATUSOT: 1,
        IDUSRAJUSTE: 0,
        DTAJUSTE: "",
        QTDTOTALITENSAJUSTE: 0
      };
      let textoFuncao = 'EXPEDICAO/ERRO AO CRIAR OT COM SUCESSO';

      const textDados = JSON.stringify(postData);
  
      await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao Salvar a OT.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        },
      });

      // handleClick();
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
    dadosEmpresa,
    dadosProdutosTabela,
    setDadosProdutosTabela,
    produtoSalvo,
    setProdutoSalvo,
    onSubmit,
  };
};
