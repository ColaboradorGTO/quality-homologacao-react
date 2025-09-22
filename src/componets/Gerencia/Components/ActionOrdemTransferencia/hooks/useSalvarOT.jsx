import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";

export const useSalvarOT = ({handleClick}) => {
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
      const response = await get(`/listaProdutos?idEmpresa=${usuarioLogado?.IDEMPRESA}&dsProduto=${produto} `);
      return response.data;
    },
    { enabled: produto.length === 8, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


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

    try {

      const postData = {
        IDEMPRESAORIGEM: empresaOrigem,
        IDEMPRESADESTINO: empresaDestino,
        DATAEXPEDICAO: "",
        IDOPERADOREXPEDICAO: usuarioLogado.id,
        NUTOTALITENS: nCtTotalItens,
        QTDTOTALITENS: nQtdTotalItens,
        QTDTOTALITENSRECEPCIONADO: 0,
        QTDTOTALITENSDIVERGENCIA: 0,
        NUTOTALVOLUMES: 0,
        TPVOLUME: "",
        VRTOTALCUSTO: 0,
        VRTOTALVENDA: dVlrTotalVenda,
        DTRECEPCAO: "",
        IDOPERADORRECEPTOR: 0,
        DSOBSERVACAO: observacao,
        IDUSRCANCELAMENTO: 0,
        DTULTALTERACAO: "",
        IDSTDIVERGENCIA: 0,
        OBSDIVERGENCIA: "",
        STEMISSAONFE: "False",
        NUMERONFE: "",
        STENTRADAINVENTARIO: "False",
        QTDCONFERENCIA: 0,
        dadosdetalheot,
        IDRESUMOOT: parseInt(nIdResumoOT),
        IDSTATUSOT: parseInt(1),
        IDUSRAJUSTE: 0,
        DTAJUSTE: "",
        QTDTOTALITENSAJUSTE: 0,
        CONFEREITENS: 'False',
        IDROTINA: 1,
        DATAENTREGA: dataEntrega
      };
      const response = await post('/resumo-ordem-transferencia', postData);
  
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'EXPEDICAO/OT CRIADA COM SUCESSO';
  
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
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
       let textoFuncao = 'EXPEDICAO/ERRO AO CRIAR OT COM SUCESSO';
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
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

      handleClick();
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
