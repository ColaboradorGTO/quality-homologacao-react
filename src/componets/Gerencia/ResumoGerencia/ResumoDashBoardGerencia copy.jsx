import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { ActionListaCaixa } from "../ResumoGerencia/Components/actionListaCaixa";
import { ActionListaVendasPCJ } from "../ResumoGerencia/Components/actionListaVendasPCJ";
import { ActionListaVendasVendedor } from "../ResumoGerencia/Components/actionListaVendasVendedor";
import { ActionListaVendasAtiva } from "../ResumoGerencia/Components/actionListaVendasAtiva";
import { ActionListaVendasCanceladas } from "../ResumoGerencia/Components/actionListaVendasCanceladas";
import { ActionListaVendasConvenio } from "../ResumoGerencia/Components/actionListaVendasConvenio";
import { ActionListaVendasDescontoFuncionario } from "../ResumoGerencia/Components/actionListaVendasDescontoFuncionarios"
import { ActionMain } from "../../Actions/actionMain";
import { InputField } from "../../Buttons/Input";
import { ButtonType } from "../../Buttons/ButtonType";
import { ResultadoResumo } from "../../ResultadoResumo/ResultadoResumo";
import { getDataAtual } from "../../../utils/dataAtual";
import { get } from "../../../api/funcRequest";
import { formatMoeda } from "../../../utils/formatMoeda";
import { AiOutlineSearch } from "react-icons/ai";
import { BsGem } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { toFloat } from "../../../utils/toFloat";
import { ActionTabelaMainExtrato } from "./Components/ActionExtrato/actionTabelaMainExtrato";
import { useQuery } from "react-query";
import { useFetchData } from "../../../hooks/useFetchData";
import { dataFormatada } from "../../../utils/dataFormatada";


export const ResumoDashBoardGerencia = ({ }) => {
  const [actionVisivel, setActionVisivel] = useState(true);
  const [resumoVisivel, setResumoVisivel] = useState(false);
  const [dataPesquisa, setDataPesquisa] = useState('');
  // const [dadosListaCaixa, setDadosListaCaixa] = useState([]);
  // const [dadosVendasPCJ, setDadosVendasPCJ] = useState([])
  const [dadosVendasVendedor, setDadosVendasVendedor] = useState([])
  const [dadosVendasAtivas, setDadosVendasAtivas] = useState([])
  const [dadosVendasCanceladas, setDadosVendasCanceladas] = useState([])
  const [dadosVendasConvenioDescontoFuncionario, setDadosVendasConvenioDescontoFuncionario] = useState([])
  const [dadosVendasConvenioDesconto, setDadosVendasConvenioDesconto] = useState([])
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [dadosVendas, setDadosVendas] = useState([]);
  const [dadosDespesaLoja, setDadosDespesaLoja] = useState([]);
  const [dadosExtratoQuebra, setDadosExtratoQuebra] = useState([]);
  const [dadosTotalDepositos, setDadosTotalDepositos] = useState([]);
  const [dadosTotalFaturas, setDadosTotalFaturas] = useState([]);
  const [dadosTotalDespesas, setDadosTotalDespesas] = useState([]);
  const [dadosTotalAdiantamentos, setDadosTotalAdiantamentos] = useState([]);
  const [dadosAjusteExtrato, setDadosAjusteExtrato] = useState([]);
  const [dadosExtratoLoja, setDadosExtratoLoja] = useState([]);
  
  const navigate = useNavigate();
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  
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
    
    const dataInicio = getDataAtual();
    setDataPesquisa(dataInicio);
    
    
  }, [usuarioLogado]);
  const empresa = usuarioLogado && usuarioLogado.IDEMPRESA;

  // const { data: dadosDespesas = [] } = useFetchData('despesa-lojas-dash', `/despesa-lojas-dash?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
  const { data: dadosDespesas = [], error: errorDespesas, isLoading: isLoadingDespesas, refetch: refetchDespesas } = useQuery(
    'despesa-lojas-dash',
    async () => {
      if(usuarioLogado) {

        const response = await get(`/despesa-lojas-dash?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
        return response.data;
      }
      return [];
    },
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );
  
  const { data: dadosAdiantamento = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchAdiantamento } = useQuery(
    'adiantamentos-salarial',
    async () => {
      if (usuarioLogado) {
        const response = await get(`/adiantamentos-salarial?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
        return response.data;
      }
      return [];
    },
    { enabled: !!usuarioLogado, staleTime: 5 * 60 * 1000 }
  );
  const { data: dadosQuebraCaixa = [], error: errorQuebraCaixa, isLoading: isLoadingQuebraCaixa, refetch: refetchQuebraCaixa } = useQuery(
    'quebra-caixa-loja-resumo',
    async () => {
      const response = await get(`/quebra-caixa-loja-resumo?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  const { data: dadosResumoVendas = [], error: errorResumo, isLoading: isLoadingResumo, refetch: refetchResumoVendas } = useFetchData('quebra-caixa-loja-resumo', `/quebra-caixa-loja-resumo?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
  // const { data: dadosResumoVendas = [], error: errorResumo, isLoading: isLoadingResumo, refetch: refetchResumoVendas } = useQuery(
  //   'quebra-caixa-loja-resumo',
  //   async () => {
  //     if(usuarioLogado) {
  //       const response = await get(`/quebra-caixa-loja-resumo?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
  //       return response.data;

  //     }
  //     return [];
  //   },
  //   { enabled: !!usuarioLogado, staleTime: 5 * 60 * 1000 }
  // );

  const getResumoVendas = async () => {
    try {
      const response = await get(`/resumoVendaGerencia?idEmpresa=${usuarioLogado.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);

      if (response.data && response.data.length > 0) {
        setDadosResumoVendas(response.data);
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar resumo das vendas: ', error);
    }
  };

  const dados = dadosResumoVendas.map((item, index) => {
    // const totalVenda = 0;
    const totalVenda = toFloat(item.VRRECDINHEIRO) + toFloat(item.VRRECCARTAO) + toFloat(item.VRRECCONVENIO) + toFloat(item.VRRECPOS) + toFloat(item.VRRECCHEQUE);

    return {
      VRRECDINHEIRO: toFloat(item.VRRECDINHEIRO),
      VRRECCARTAO: toFloat(item.VRRECCARTAO),
      VRRECCONVENIO: toFloat(item.VRRECCONVENIO),
      VRRECPOS: toFloat(item.VRRECPOS),
      VRRECCHEQUE: toFloat(item.VRRECCHEQUE),
      QTDVENDAS: toFloat(item.QTDVENDAS),
      VRTICKETWEB: toFloat(item.VRTICKETWEB),
      totalVenda: totalVenda
    }
  })

  // const getListaDespesasLoja = async () => {
  //   try {
  //     const response = await get(`/despesasLojaADM?idEmpresa=${usuarioLogado.IDEMPRESA}&dataPesquisa=${dataPesquisa}`);
  //     if (response.data) {
  //       setDadosDespesaLoja(response.data);
  //     }
  //     return response.data;
  //   } catch (error) {
  //     console.log('Erro ao buscar resumo das vendas: ', error);
  //   }
  // };

  // const dadosDespesas = dadosDespesaLoja.map((item, index) => {
  //   return {
  //     VRDESPESA: toFloat(item.VRDESPESA),
  //   }
  // })

  const { data: dadosListaCaixa = [], error: errorCaixaMovimento, isLoading: isLoadingCaixaMovimento, refetch: refetchCaixaMovimento } = useFetchData('lista-caixas-movimento-gerencia', `/lista-caixas-movimento-gerencia?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataFechamento=${dataPesquisa}`);
  const { data: dadosVendasPCJ = [], error: errorVendasPCJ, isLoading: isLoadingPCJ, refetch: refetchPCJ } = useFetchData('lista-caixas-movimento-gerencia', `/lista-caixas-movimento-gerencia?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataFechamento=${dataPesquisa}`);
 
  const getListaCaixaMovimento = async () => {
    try {
      const response = await get(`/lista-caixas-movimento-gerencia?idEmpresa=${usuarioLogado.IDEMPRESA}&dataFechamento=${dataPesquisa}`);
      if (response && response.data) {
        setDadosListaCaixa(response.data)
        setDadosVendasPCJ(response.data)
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, listaCaixasFechados")
    }

  }

  const getListaVendasVendedor = async () => {
    try {
      const response = await get(`/vendaVendedorGerencia?idEmpresa=${usuarioLogado.IDEMPRESA}&dataFechamento=${dataPesquisa}`);
      if (response.data && response.data.length > 0) {
        setDadosVendasVendedor(response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }

  const getListaVendasAtivas = async () => {
    try {
      const response = await get(`/vendasAtivasResumoGerencia?idEmpresa=${usuarioLogado.IDEMPRESA}&dataFechamento=${dataPesquisa}`);
      if (response.data && response.data.length > 0) {
        setDadosVendasAtivas(response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }
  }

  const getListaVendasCanceladas = async () => {
    try {
      const response = await get(`/vendaCanceladaResumo?idEmpresa=${usuarioLogado.IDEMPRESA}&dataPesquisaInicio=${dataPesquisa}&dataPesquisaFim=${dataPesquisa}`);
      if (response.data && response.data.length > 0) {
        setDadosVendasCanceladas(response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }
  }

  const getVendasConvenioDesconto = async () => {
    try {
      const response = await get(`/resumoVendaConvenioDesc?idEmpresa=${usuarioLogado.IDEMPRESA}&dataInicio=${dataPesquisa}&dataFechamento=${dataPesquisa}`);
      if (response.data && response.data.length > 0) {
        setDadosVendasConvenioDesconto(response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }
  }

  const getVendasConvenioFuncionario = async () => {
    try {
      const response = await get(`/resumoVendaConvenioDesc?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataInicio=${dataPesquisa}&dataFechamento=${dataPesquisa}`);
      if (response.data && response.data.length > 0) {
        setDadosVendasConvenioDescontoFuncionario(response.data);
      }
      return response.data;

    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }
  }

  const getListaSaldoExtratoLoja = async () => {
    try {
      const response = await get(`/extratoLojaPeriodo?idEmpresa=${usuarioLogado?.IDEMPRESA}&dataPesquisaInicio=${dataPesquisa}&dataPesquisaFim=${dataPesquisa}`)
      if (response.data && response.data.length > 0) {
        setDadosExtratoLoja(response.data)
        setDadosVendas(response.data)
        setDadosExtratoQuebra(response.data[0].quebracaixa)
        setDadosTotalDepositos(response.data[0].totalDepositos)
        setDadosTotalFaturas(response.data[0].totalFaturas)
        setDadosTotalDespesas(response.data[0].despesas)
        setDadosTotalAdiantamentos(response.data[0].adiantamentos)
        setDadosAjusteExtrato(response.data[0].ajusteextrato)

      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar marcas: ', error)
    }
  }

  const handleClick = async () => {
    if (usuarioLogado && usuarioLogado.IDEMPRESA && dataPesquisa) {
      // getListaCaixaMovimento();
      refetchCaixaMovimento()
      refetchPCJ()
      setResumoVisivel(true)
      // getResumoVendas();
      refetchResumoVendas()
      getListaVendasVendedor();
      getListaVendasAtivas();
      getListaVendasCanceladas();
      getVendasConvenioDesconto();
      getVendasConvenioFuncionario();
      getListaSaldoExtratoLoja();
    
      refetchQuebraCaixa()
      refetchAdiantamento()
      refetchDespesas()
    }
  }

  return (
    <Fragment>

      {actionVisivel && (
        <ActionMain
          title={"Dashboard Gerencia"}
          subTitle="Movimento de Caixa"
          linkComponentAnterior={["Home"]}
          linkComponent={["Tela Principal"]}

          InputFieldDTConsultaComponent={InputField}
          labelInputFieldDTConsulta="Data Consulta"
          valueDTCosulta={dataPesquisa}
          onChangeInputFieldDTConsulta={(e) => setDataPesquisa(e.target.value)}

          ButtonSearchComponent={ButtonType}
          linkNomeSearch={"Pesquisar"}
          onButtonClickSearch={handleClick}
          corSearch={"primary"}
          IconSearch={AiOutlineSearch}
        />

      )}

      {resumoVisivel && (

        <Fragment>


          <div style={{ marginTop: "1rem" }}>
            <ResultadoResumo
              nomeVendas="Vendas Loja"
              valorVendas={formatMoeda(toFloat(dados[0]?.totalVenda))}
              cardVendas={true}
              IconVendas={MdOutlinePayment}

              nomeDespesas="Despesas"
              cardDespesas={true}
              valorDespesas={formatMoeda(toFloat(dadosDespesaLoja[0]?.VRDESPESA))}
              IconValorDespesas={FaCashRegister}

              nomeTicketMedio="Ticket Médio"
              valorTicketMedio={formatMoeda(toFloat(dados[0]?.VRTICKETWEB))}
              cardTicketMedio={true}
              IconTicketMedio={FaRegLightbulb}

              nomeCliente="Clientes"
              cardCliente={true}
              numeroCliente={toFloat(dados[0]?.QTDVENDAS)}
              IconNumeroCliente={BsGem}

              // iconSize={100}
              // iconColor={"#fff"}
              // empresaUsuario={empresas}
              // dataPesquisa={dataPesquisa}
            />

            <ActionListaCaixa 
              dadosListaCaixa={dadosListaCaixa} 
              dadosDespesas={dadosDespesas}  
              dadosAdiantamento={dadosAdiantamento}
              dadosQuebraCaixa={dadosQuebraCaixa}
            />

            <ActionTabelaMainExtrato
              dadosExtratoLoja={dadosExtratoLoja}
              dadosVendas={dadosVendas}
              dadosExtratoQuebra={dadosExtratoQuebra}
              dadosTotalDepositos={dadosTotalDepositos}
              dadosTotalFaturas={dadosTotalFaturas}
              dadosTotalDespesas={dadosTotalDespesas}
              dadosTotalAdiantamentos={dadosTotalAdiantamentos}
              dadosAjusteExtrato={dadosAjusteExtrato}
            />

            <ActionListaVendasPCJ dadosVendasPCJ={dadosVendasPCJ} />

            <ActionListaVendasVendedor dadosVendasVendedor={dadosVendasVendedor} />
       
            <ActionListaVendasAtiva empresa={empresa} dadosVendasAtivas={dadosVendasAtivas} />

            <ActionListaVendasCanceladas empresa={empresa} dadosVendasCanceladas={dadosVendasCanceladas} />

            <ActionListaVendasConvenio dadosVendasConvenioDesconto={dadosVendasConvenioDesconto} />

            <ActionListaVendasDescontoFuncionario dadosVendasConvenioDescontoFuncionario={dadosVendasConvenioDescontoFuncionario} />
          </div>

        </Fragment>
      )}

    </Fragment>
  )
}

//  2620 linhas antes de refatorar