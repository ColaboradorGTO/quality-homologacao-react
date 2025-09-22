import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";

export const useEditarOT = ({dadosDetalheTransferencia}) => {
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [dataCadastro, setDataCadastro] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [linhaSelecionada, setLinhaSelecionada] = useState(null)
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

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
    const dataAtual = getDataAtual();
    setDataCadastro(dataAtual);

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

  console.log(produto, "dadosProdutos")


  const onSubmit = async () => {
    useEffect(() => {

      if (usuarioLogado?.IDEMPRESA <= 0 && empresaDestino <= 0) {
        Swal.fire({
          title: 'A Loja de Origem e Destino devem ser Preenchidas!',
          icon: 'info',
          confirmButtonText: 'Ok',
          customClass: {
            container: 'custom-swal',
          }
        });
      }
    }, [dadosProdutos]);

    if(dadosProdutos.length == 0) {
      Swal.fire({
        title: 'Atenção!',
        icon: 'warning',
        text: 'Informar os produtos da OT!',
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if(dadosProdutos.length > 200) {
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

    const dadosDetalheot = dadosDetalheTransferencia.map((item) => ({
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

    const nCtTotalItens = dadosDetalheot.length;
    const nQtdTotalItens = dadosDetalheot.reduce((acc, item) => acc + item.QTDEXPEDICAO, 0);
    const dVlrTotalVenda = dadosDetalheot.reduce((acc, item) => acc + (item.QTDEXPEDICAO * item.VLRUNITVENDA), 0);
    const dVlrTotalCusto = dadosDetalheot.reduce((acc, item) => acc + (item.QTDEXPEDICAO * item.VLRUNITCUSTO), 0);

    const postData = {
      IDEMPRESAORIGEM: usuarioLogado.IDEMPRESA,
      IDEMPRESADESTINO: empresaDestino,
      DATAEXPEDICAO: "",
      IDOPERADOREXPEDICAO: usuarioLogado.id,
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
      dadosDetalheot,
      IDRESUMOOT: dadosDetalheTransferencia[0]?.IDRESUMOOT,
      IDSTATUSOT: parseInt(1),
      IDUSRAJUSTE: 0,
      DTAJUSTE: "",
      QTDTOTALITENSAJUSTE: 0,
    };

    try {

      const response = await put('/resumo-ordem-transferencia/:id', postData);
  
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'GERENCIA/EDIÇÃO OT';
  
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };
  
      const responsePost = await post('/log-web', createData)
  
      Swal.fire({
        title: 'Cadastro',
        text: 'OT Alterada com Sucesso',
        icon: 'success'
      });
  
  
      handleClose();
      return responsePost.data;
    } catch (error) {
      let textoFuncao = 'GERENCIA/ERRO AO EDITAR OT';
  
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: 'GERENCIA/ERRO AO EDITAR OT',
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
    usuarioLogado,
    setUsuarioLogado,
    linhaSelecionada,
    setLinhaSelecionada,
    dadosEmpresa,
    dadosProdutos,
    onSubmit,
  };
};