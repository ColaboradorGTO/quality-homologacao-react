import { Fragment, useEffect, useMemo, useState } from "react";
import { ListaDeVendasDosCaixas } from "../ActionsMovCaixasLojas/ListaDeVendasDosCaixas";
import { ListaDeExtratoDoDia } from "../ActionsMovCaixasLojas/ListaDeExtratoDoDia";
import { ListaDeVendasVendedor } from "../ActionsMovCaixasLojas/ListaDeVendasVendedor";
import { ListaDeVendasAtivas } from "../ActionsMovCaixasLojas/ListaDeVendasAtivas";
import { ListaDeFechamentoDosCaixas } from "../ActionsMovCaixasLojas/ListaDeFechamentoDosCaixas";
import { ListaDeDespesasLancadas } from "../ActionsMovCaixasLojas/ListaDeDespesasLancadas";
import { ListaDeFaturasLançadas } from "../ActionsMovCaixasLojas/ListaDeFaturasLançadas";
import { ListaDeVoucherLancados } from "../ActionsMovCaixasLojas/ListaDeVoucherLancados";
import { ResultadoResumo } from "../ResultadoResumo/ResultadoResumo";
import { ListaDeVendasCanceladas } from "../ActionsMovCaixasLojas/ListaDeVendasCanceladas";
import { ActionMain } from "../Actions/actionMain";
import { InputSelectAction } from "../Inputs/InputSelectAction";
import { InputField } from "../Buttons/Input";
import { ButtonSearch } from "../Buttons/ButtonSearch";
import { get } from "../../api/funcRequest";
import { formatMoeda } from "../../utils/formatMoeda";
import Accordion from 'react-bootstrap/Accordion';
import { dataFormatada } from "../../utils/dataFormatada";
import { FilterComponent } from "../ButtonsTabela/FilterComponent";
import DataTable from 'react-data-table-component';
import { ButtonProduto } from "../ButtonsTabela/ButtonProduto";
import { ButtonVenda } from "../ButtonsTabela/ButtonVenda";
import { ButtonPagamento } from "../ButtonsTabela/ButtonPagamento";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../Buttons/InputFieldModal";
import AsyncSelectAction from "../Select/AsyncSelectAction";
import { useNavigate } from "react-router-dom"
import { ActionListaCaixa } from "../Gerencia/ResumoGerencia/actionListaCaixa";

export const ResumoDashBoardGerencia = ({ }) => {
  const [actionVisivel, setActionVisivel] = useState(true);
  const [resumoVisivel, setResumoVisivel] = useState(false);
  const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false)
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false)
  const [modalVendaVisivel, setModalVendaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [nomeEmpresaSelecionada, setNomeEmpresaSelecionada] = useState('')

  const [dataConsulta, setDataConsulta] = useState('');
  const [datapesq, setDatapesq] = useState('')
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');

  const [resumoVendas, setResumoVendas] = useState([]);
  const [dadosListaCaixa, setDadosListaCaixa] = useState([]);
  const [dadosVendasPCJ, setDadosVendasPCJ] = useState([])
  const [dadosCaixaFechados, setDadosCaixaFechados] = useState([])
  const [dadosVendasVendedor, setDadosVendasVendedor] = useState([])
  const [dadosVendasAtivas, setDadosVendasAtivas] = useState([])
  const [dadosVendasCanceladas, setDadosVendasCanceladas] = useState([])
  const [dadosVendas, setDadosVendas] = useState([])
  const [dadosVendasConvenioDescontoFuncionario, setDadosVendasConvenioDescontoFuncionario] = useState([])
  const [dadosVendasConvenioDesconto, setDadosVendasConvenioDesconto] = useState([])
  const [dadosProdutoModal, setDadosProdutoModal] = useState([])
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([])
  const [dadosVendasCanceladaModal, setDadosVendasCanceladaModal] = useState([])

  const [loading, setLoading] = useState(true);
  const [qtdClientes, setQtdClientes] = useState('');
  const [totalTicketMedio, setTotalTicketMedio] = useState('');
  const [totalRecebido, setTotalRecebido] = useState('');
  const [idGrupo, setIdGrupo] = useState(0)
  const [dadosExtratoDoDia, setDadosExtratoDoDia] = useState([])
  const [dadosDetalheFatura, setDadosDetalheFatura] = useState([])
  const [dadosDetalheFaturaLancadas, setDadosDetalheFaturaLancadas] = useState([])
  const [dadosDetalheDespesas, setDadosDetalheDespesas] = useState([])
  const [dadosDetalheVoucher, setDadosDetalheVoucher] = useState([])

  const [usuarioLogado, setUsuarioLogado] = useState(null);

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

  }, [usuarioLogado]);

  useEffect(() => {
    const dataAtual = new Date();
    const dataFormatadaAtual = dataAtual.toISOString().slice(0, 10);
    setDatapesq(dataFormatadaAtual)
    
  }, [])

  // Início Lista de Empresas
  useEffect(() => {
    if (empresas.length === 0 && loading) {
      getTodasEmpresas();
    }
  }, [empresas, loading]);
  
  const getTodasEmpresas = async () => {
    try {
      const response = await get("/empresas",)
      if (response.data) {
        setEmpresas(response.data)
      }

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  // Fim Lista de Empresas

  useEffect(() => {
    if (empresaSelecionada) {
      getResumoVendas(empresaSelecionada);
    }
  }, [empresaSelecionada]);

  const getResumoVendas = async (empresaSelecionada) => {

    try {

      const dtURL = dataFormatada(dataConsulta)
      const urlData = encodeURIComponent(dtURL)
      dataFormatada(datapesq)
      const response = await get(`/resumoVendaGerencia?idEmpresa=${empresaSelecionada}&dataPesquisa=${urlData}`);

      if (response.data) {
        setResumoVendas(response.data);
        setTotalRecebido(response.data[0].VRTOTALVENDA)
        setQtdClientes(parseFloat(response.data[0].QTDVENDAS))
        setTotalTicketMedio(response.data[0].VRTICKETWEB)
        setDatapesq(response.data)

      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar resumo das vendas: ', error);
    }
  };

  
  // Início Lista de Caixas 
  useEffect(() => {
    if (empresaSelecionada && datapesq) {
      getListaCaixaMovimento(empresaSelecionada);
    }
  }, [empresaSelecionada, datapesq])

  const getListaCaixaMovimento = async (empresaSelecionada) => {

    try {
      dataFormatada(datapesq)
      const response = await get(`/listaCaixaMovimentoGerencia?idEmpresa=${empresaSelecionada}&dataFechamento=${datapesq}`);
      if (response.data && response.data.length > 0) {
        setDadosListaCaixa(response.data)
        setDadosVendasPCJ(response.data)
        
      }
      return response.data;
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, listaCaixasFechados")
    }

  }

  const calcularTotalVendido = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDODINHEIRO) +
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOCARTAO) +
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOPOS) +
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOCONVENIO) +
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOVOUCHER) +
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOPIX) +
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOMOOVPAY)
  
    );
  }
  const calcularTotalVrDisponivel = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.venda[0]['venda-movimento'].TOTALVENDIDODINHEIRO) +
      toFloat(item.fatura[0]['fatura-movimento'].TOTALRECEBIDOFATURA) 
    )
  }

  const calcularTotalPCJTotal = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value)
  
    const vrPCJ18 = toFloat(item.vendapcj[0]['venda-pcj'].TOTALPCJ18);
    const vrPCJ78 = toFloat(item.vendapcj[0]['venda-pcj'].TOTALPCJ78);

    const totalPCJ = vrPCJ18 !== 0 ?  (vrPCJ78 / vrPCJ18) * 100 : 0;

    return totalPCJ;
    
  }
  const dadoCaixaLista = dadosListaCaixa.map((item, index) => {
    let totalVendido = calcularTotalVendido(item);
    let vrDisponivel = calcularTotalVrDisponivel(item);
    let pcjTotal = calcularTotalPCJTotal(item)
    let contador = index + 1;
    let vrFaturasTotal = parseFloat(item.fatura[0]['fatura-movimento'].TOTALRECEBIDOFATURA) + parseFloat(item.faturapix[0]['fatura-movimento-pix'].TOTALRECEBIDOFATURAPIX);
  
    return {
      IDCAIXAWEB: item.caixa.IDCAIXAWEB,
      ID: item.caixa.ID,
      DSCAIXA: item.caixa.DSCAIXA,
      DTABERTURA: item.caixa.DTABERTURA,
      NOFUNCIONARIO: item.caixa.NOFUNCIONARIO,
      NUCPF: item.caixa.NUCPF,
      STFECHADO: item.caixa.STFECHADO,
      VRRECDINHEIRO: item.caixa.VRRECDINHEIRO,

    
      TOTALRECEBIDOFATURA: parseFloat(item.fatura[0]['fatura-movimento'].TOTALRECEBIDOFATURA),
      TOTALRECEBIDOFATURAPIX: parseFloat(item.faturapix[0]['fatura-movimento-pix'].TOTALRECEBIDOFATURAPIX),

      TOTALVENDIDODINHEIRO: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDODINHEIRO),
      TOTALVENDIDOCARTAO: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOCARTAO),
      TOTALVENDIDOPOS: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOPOS),
      TOTALVENDIDOPIX: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOPIX),
      TOTALVENDIDOMOOVPAY: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOMOOVPAY),
      TOTALVENDIDOVOUCHER: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOVOUCHER),
      TOTALVENDIDOCONVENIO: parseFloat(item.venda[0]['venda-movimento'].TOTALVENDIDOCONVENIO),
      TOTALVENDIDO: item.venda[0]['venda-movimento'].TOTALVENDIDO,
      TOTALNOTA: item.venda[0]['venda-movimento'].TOTALNOTA,

      TOTALPCJ18: item.vendapcj[0]['venda-pcj'].TOTALPCJ18,
      TOTALPCJ78: item.vendapcj[0]['venda-pcj'].TOTALPCJ78,

      totalVendido: totalVendido,
      vrDisponivel: vrDisponivel,
      pcjTotal: pcjTotal,
      vrFaturasTotal,
      
    };
  });
  const colunaListaCaixa = [
    {
      header: 'Nº Movimento',
      body: row => row.ID,
      sortable: true,
      
    },
    {
      header: 'Caixa',
      body: row => row.IDCAIXAWEB + row.DSCAIXA,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => dataFormatada(row.DTABERTURA),
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      header: 'Fatura',
      body: row => formatMoeda(row.TOTALRECEBIDOFATURA),
      sortable: true,
    },
    {
      header: 'Fatura PIX',
      body: row => formatMoeda(row.TOTALRECEBIDOFATURAPIX),
      sortable: true,
    },

    {
      header: 'Total Fatura',
      body: row => formatMoeda(row.vrFaturasTotal),
      sortable: true,
    },
    {
      header: 'Dinheiro',
      body: row => formatMoeda(row.TOTALVENDIDODINHEIRO),
      sortable: true,
    },
    {
      header: 'Cartao',
      body: row => formatMoeda(row.TOTALVENDIDOCARTAO),
      sortable: true,
    },
    {
      header: '% PCJ',
      body: row => (
        <div style={{ color: row.pcjTotal === 0 ? 'red' : 'blue' }}>
          {formatMoeda(row.pcjTotal)}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'POS',
      body: row => formatMoeda(row.TOTALVENDIDOPOS),
      sortable: true,
    },
    {
      header: 'PIX',
      body: row => formatMoeda(row.TOTALVENDIDOPIX),
      sortable: true,
    },
    {
      header: 'Voucher',
      body: row => formatMoeda(row.TOTALVENDIDOVOUCHER),
      sortable: true,
    },
    {
      header: 'Convênio',
      body: row => formatMoeda(row.TOTALVENDIDOCONVENIO),
      sortable: true,
    },
    {
      header: 'Total',
      body: row => <div> {formatMoeda(row.totalVendido)}  </div>,
      sortable: true,
    },
    {
      header: 'Disponível',
      body: row => <div> {formatMoeda(row.vrDisponivel)}</div>,
      sortable: true,
    },
    {
      header: 'Situação',
      body: row => (
        <div style={{ color: row.STFECHADO === 'FALSE' ? 'blue' : 'red' }}>
          {row.STFECHADO === 'FALSE' ? 'ABERTO' : 'FECHADO'}
        </div>
      ),
      sortable: true,
    },

  ]
  // FIM Lista de Caixas

  //  Início Lista de Vendas PCJ
  const colunaVendasPCJ = [
    {
      header: 'Nº Movimento',
      body: row => row.ID,
      sortable: true,
      
    },
    {
      header: 'Caixa',
      body: row => row.IDCAIXAWEB + row.DSCAIXA,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => dataFormatada(row.DTABERTURA),
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      header: 'Total CredS 1-8',
      body: row => formatMoeda(row.TOTALPCJ18),
      sortable: true,
    },
    {
      header: 'Total CredS 7-8',
      body: row => formatMoeda(row.TOTALPCJ78),
      sortable: true,
    },
    {
      header: '% PCJ',
      body: row => (
        <div style={{ color: row.pcjTotal === 0 ? 'red' : 'blue' }}>
          {formatMoeda(row.pcjTotal)}
        </div>
      ),
      sortable: true,
    },

  ]
  // Fim Lista de Venda PCJ

  // Início Lista de Vendas Vendedor
  useEffect(() => {
    if (empresaSelecionada && datapesq) {
      getListaVendasVendedor(empresaSelecionada);
    }
  }, [empresaSelecionada])
  const getListaVendasVendedor = async (empresaSelecionada) => {
    try {
   
        dataFormatada(datapesq);
        // console.log(datapesq); 
        const response = await get(`/vendaVendedorGerencia?idEmpresa=${empresaSelecionada}&dataFechamento=${datapesq}`);
        if (response.data && response.data.length > 0) {
          setDadosVendasVendedor(response.data);
          console.log(response.data, 'Vendas vendedor');
        }
        return response.data;
      
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }
  const dadosVendedorVendas = dadosVendasVendedor.map((item, index) => {
    let contador = index + 1;
    const totalVendido = parseFloat(item.totalVendido[0].TOTALVENDIDOVENDEDOR) || 0;
    const vouchers = parseFloat(item.Vouchers) || 0;

    let vrVendidoVendedor = totalVendido - vouchers;
    return {
      VENDEDOR_MATRICULA: item.vendedor.VENDEDOR_MATRICULA,
      VENDEDOR_NOME: item.vendedor.VENDEDOR_NOME,
      QTDVENDIDOVENDEDOR: item.totalVendido[0].QTDVENDIDOVENDEDOR,
      TOTALVENDIDOVENDEDOR: parseFloat(item.totalVendido[0].TOTALVENDIDOVENDEDOR),
      Vouchers: parseFloat(item.Vouchers),
      vrVendidoVendedor
    };
  });
  const colunaVendidoVendedor = [
    {
      header: 'Matrícula',
      body: row => row.VENDEDOR_MATRICULA,
      sortable: true,
      width: "7%"
    },
    {
      header: 'Nome',
      body: row => row.VENDEDOR_NOME,
      sortable: true,
    },
    {
      header: 'Qtd Produto',
      body: row => parseFloat(row.QTDVENDIDOVENDEDOR),
      sortable: true,
    },
    {
      header: 'Valor Vendido',
      body: row => formatMoeda(row.TOTALVENDIDOVENDEDOR),
      sortable: true,
    },
    {
      header: 'Vourcher Recebido',
      body: row => formatMoeda(row.Vouchers),
      sortable: true,
    },
    {
      header: 'Valor Líquido',
      body: row => formatMoeda(row.vrVendidoVendedor),
      sortable: true,
    },

  ]

  // Fim Lista de Vendas Vendedor


  // Inicio Vendas Ativas
  useEffect(() => {
    if (empresaSelecionada && datapesq) {
      getListaVendasAtivas(empresaSelecionada);
    }
  }, [empresaSelecionada])

  const getListaVendasAtivas = async (empresaSelecionada) => {
    try {
      if (handleClick()) {
        const formatData = dataFormatada(datapesq);
     
        // rota vendasCanceladasResumoGerencia
        const response = await get(`/vendasAtivasResumoGerencia?idEmpresa=${empresaSelecionada}&dataFechamento=${datapesq}`);
        if (response.data && response.data.length > 0) {
          setDadosVendasAtivas(response.data);
          // console.log(response.data, 'Vendas Ativas');
        }
        return response.data;
      }
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }
  const dadosAtivasVendas = dadosVendasAtivas.map((item, index) => {
    let contador = index + 1; 

    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      STCONFERIDO: item.STCONFERIDO,
      VRTOTALPAGO: parseFloat(item.VRTOTALPAGO),
      VRTOTALDESCONTO: parseFloat(item.VRTOTALDESCONTO),
      VRTOTALVENDA: parseFloat(item.VRTOTALVENDA),
      STCONTINGENCIA: item.STCONTINGENCIA,
      contador
    };
  });
  const colunaVendasAtivas = [
    {
      header: '*',
      body: row => row.contador,
      sortable: true,
      width: "5%"
    },
    {
      header: 'Caixa',
      body: row => row.IDCAIXAWEB + row.DSCAIXA,
      sortable: true,
    },
    {
      header: 'Nº Venda',
      body: row => parseFloat(row.IDVENDA),
      sortable: true,
    },
    {
      header: 'NFCe',
      body: row => row.NFE_INFNFE_IDE_NNF,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => dataFormatada(row.DTHORAFECHAMENTO),
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      header: 'Valor',
      body: row => formatMoeda(row.VRTOTALPAGO),
      sortable: true,
    },
    {
      header: 'Nota',
      body: row => (
        <div style={{color: row.STCONTINGENCIA == 'True' ? 'blue' : 'red'}}>
          {row.STCONTINGENCIA == 'True' ? 'Contigência' : 'Emitida'}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Opções',
      button: true,
      width: '10%',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between" }}
        >
          <div className="p-1">
            <ButtonProduto
              nome={"Produtos"}
              onClickProduto={() => handleClickProduto(row)}
            />
          </div>
          <div className="p-1">
            <ButtonVenda
              nome={"Vendas"}
              onClickVenda={() => handleClickVenda(row)}
            />
          </div>
          <div className="p-1">
            <ButtonPagamento
              nome={"Pagamentos"}
              onClickPagamento={() => handleClickPagamento(row)}
            />
          </div>
        </div>
      ),
    },

  ]

  const handleEditProduto = async (empresaSelecionada, IDVENDA) => {
    try {
      const response = await get(`/detalheVenda?idEmpresa=${empresaSelecionada}&idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosProdutoModal(response.data)
        setModalProdutoVisivel(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickProduto = async (row) => {
    if (empresaSelecionada && row && row.IDVENDA) {
      handleEditProduto(empresaSelecionada, row.IDVENDA)
    }
  }

  useEffect(() => {
    if (modalProdutoVisivel) {
      handleClickProduto()
    }
  }, [modalProdutoVisivel])


  const handleClickVenda = async (row) => {
    if (empresaSelecionada && row && row.IDVENDA) {
      handleEditVenda(empresaSelecionada, row.IDVENDA)
    }
  }

  const handleEditVenda = async (empresaSelecionada, IDVENDA) => {

    try {
      const response = await get(`/resumo-venda-caixa-detalhado?idEmpresa=${empresaSelecionada}&idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosVendasCanceladaModal(response.data)
        setModalVendaVisivel(true)
        
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }

  }

  const handleEditPagamento = async (IDVENDA) => {
    try {
      const response = await get(`/recebimento?idVenda${IDVENDA}`)
      if(response.data) {
        setDadosPagamentoModal(response.data)
        setModalPagamentoVisivel(true)
        console.log(response.data, 'dados pagamento')
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }
  const handleClickPagamento = (row) => {
    if(row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }
  // Fim Lista Vendas Ativas


  // Início Modais de Vendas Canceladas e Ativas
  const dados = dadosVendas.map((item) => {
    return {
      NOFANTASIA: item.NOFANTASIA,
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOFUNCIOCANCEL: item.NOFUNCIOCANCEL,
      NOFUNCAOCANCEL: item.NOFUNCAOCANCEL,
      TXTMOTIVOCANCELAMENTO: item.TXTMOTIVOCANCELAMENTO,
      VRTOTALPAGO: formatMoeda(item.VRTOTALPAGO),
      STCONTINGENCIA: item.STCONTINGENCIA,
    }
  });

  const colunasVouchers = [
    {
      header: '*',
      body: row => row.IDCAIXAWEB,
      sortable: true,
      width: '3%',
    },
    {
      header: 'Empresa',
      body: row => row.NOFANTASIA,
      sortable: true,

    },
    {
      header: 'Caixa',
      body: row => row.DSCAIXA,
      sortable: true,

    },
    {
      header: 'Nº Venda',
      body: row => row.IDVENDA,
      sortable: true,

    },
    {
      header: 'NFe/NFCe',
      body: row => row.NFE_INFNFE_IDE_NNF,
      sortable: true,

    },
    {
      header: 'Abertura',
      body: row => row.DTHORAFECHAMENTO,
      sortable: true,

    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,

    },
    {
      header: 'Valor',
      body: row => row.VRTOTALPAGO,
      sortable: true,

    },
    {
      header: 'Nota',
      body: row => row.STCONTINGENCIA,
      sortable: true,

    },
    {
      header: 'Cancelado Por',
      body: row => row.NOFUNCIOCANCEL,
      sortable: true,

    },
    {
      header: 'Função',
      body: row => row.NOFUNCAOCANCEL,
      sortable: true,

    },
    {
      header: 'Motivo',
      body: row => row.TXTMOTIVOCANCELAMENTO,
      sortable: true,

    },
    {
      header: 'Opções',
      button: true,
      width: '10%',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between" }}
        >
          <div className="p-1">
            <ButtonProduto
              nome={"Produtos"}
              onClickProduto={() => handleClickProduto(row)}
            />
          </div>
          <div className="p-1">
            <ButtonVenda
              nome={"Vendas"}
              onClickVenda={() => handleClickVenda(row)}
            />
          </div>
          <div className="p-1">
            <ButtonPagamento
              nome={"Pagamentos"}
              onClickPagamento={() => handleClickPagamento(row)}
            />
          </div>
        </div>
      ),
    },
  ]

  const dadosModalProduto = dadosProdutoModal.map((item) => {
    let situacao = item.STCANCELADO ? "Ativo" : "Cancelado";

    return {
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VUNCOM: item.VUNCOM,
      QTD: item.QTD,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      STCANCELADO: item.STCANCELADO

    }
  });

  const colunasProdutoModal = [
    {
      header: 'Código Barras',
      body: row => row.NUCODBARRAS,
      sortable: true,

    },
    {
      header: 'Descrição',
      body: row => row.DSNOME,
      sortable: true,

    },
    {
      header: 'Vr. Unit',
      body: row => formatMoeda(row.VUNCOM),
      sortable: true,

    },
    {
      header: 'QTD',
      body: row => row.QTD,
      sortable: true,


    },
    {
      header: 'Vr Recebido',
      body: row => formatMoeda(row.VRTOTALLIQUIDO),
      sortable: true,

    },
    {
      header: 'Vendedor',
      body: row => row.VENDEDOR_NOME,
      sortable: true,

    },

    {
      header: 'Situação',
      body: row => row.STCANCELADO,
      sortable: true,

    },
  ]

  const dadosPagamentos = dadosPagamentoModal.map((item) => {

    return {
      IDVENDA: item.venda.IDVENDA,
      IDEMPRESA: item.venda.IDEMPRESA,
      IDCAIXAWEB: item.venda.IDCAIXAWEB,
      IDOPERADOR: item.venda.IDOPERADOR,
      VRDINHEIRO: item.venda.VRDINHEIRO,
      VRRECCARTAO: item.venda.VRRECCARTAO,
      VRRECPOSVENDA: item.venda.VRRECPOSVENDA,
      VRRECPOS: item.venda.VRRECPOS,
      VRRECPIX: item.venda.VRRECPIX,
      VRRECMOOVPAY: item.venda.VRRECMOOVPAY,
      VRRECCONVENIO: item.venda.VRRECCONVENIO,
      VRRECVOUCHER: item.venda.VRRECVOUCHER,
      VRTOTALVENDA: item.venda.VRTOTALVENDA,
      ULTNITEM: item.venda.ULTNITEM,

      DSTIPOPAGAMENTO: item.vendaPagamento[0].pag.DSTIPOPAGAMENTO,
      NPARCELAS: item.vendaPagamento[0].pag.NPARCELAS,
      NUOPERACAO: item.vendaPagamento[0].pag.NUOPERACAO,
      NSUAUTORIZADORA: item.vendaPagamento[0].pag.NSUAUTORIZADORA,
      VALORRECEBIDO: item.vendaPagamento[0].pag.VALORRECEBIDO
    }
  });

  const colunasPagamento = [
    {
      header: 'VR. Dinheiro',
      body: row => formatMoeda(row.VRDINHEIRO),
      sortable: true,
    },
    {
      header: 'Vr. Cartão',
      body: row => formatMoeda(row.VRRECCARTAO),
      sortable: true,

    },
    {
      header: 'Vr. POS',
      body: row => formatMoeda(row.VRRECPOS),
      sortable: true,

    },
    {
      header: 'Vr. PIX',
      body: row => formatMoeda(row.VRRECPIX),
      sortable: true,

    },
    {
      header: 'Vr. MP',
      body: row => formatMoeda(row.VRRECMOOVPAY),
      sortable: true,

    },
    {
      header: 'Vr. Convênio',
      body: row => formatMoeda(row.VRRECCONVENIO),
      sortable: true,

    },
    {
      header: 'Vr. Voucher',
      body: row => formatMoeda(row.VRRECVOUCHER),
      sortable: true,

    },
    
  ]
  const colunasPagPos = [
    {
      header: 'Pagamento',
      body: row => row.DSTIPOPAGAMENTO,
      sortable: true,
    },
    {
      header: 'Parcelas',
      body: row => parseFloat(row.NPARCELAS),
      sortable: true,

    },
    {
      header: 'NSU_CTF',
      body: row => parseFloat(row.NUOPERACAO),
      sortable: true,

    },
    {
      header: 'Autorização',
      body: row => parseFloat(row.NSUAUTORIZADORA),
      sortable: true,

    },
    {
      header: 'Vr. Recebido',
      body: row => formatMoeda(row.VALORRECEBIDO),
      sortable: true,

    },

    
  ]
  // Fim Modais de Vendas Canceladas e Ativas


  //  Início Lista Vendas Canceladas

  useEffect(() => {
    if (empresaSelecionada && datapesq) {
      getListaVendasCanceladas(empresaSelecionada);
    }
  }, [empresaSelecionada])
  const getListaVendasCanceladas = async (empresaSelecionada) => {
    try {
      if (handleClick()) {
        const formatData = dataFormatada(datapesq);
        // console.log(datapesq);
        const response = await get(`/vendaCanceladaResumo?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${datapesq}&dataPesquisaFim=${datapesq}`);
        if (response.data && response.data.length > 0) {
          setDadosVendasCanceladas(response.data);
          console.log(response.data, 'Vendas Canceladas');
        }
        return response.data;
      }
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }
  const dadosCanceladasVendas = dadosVendasCanceladas.map((item, index) => {
    let contador = index + 1; 

    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOFUNCIOCANCEL: item.NOFUNCIOCANCEL,
      STCONFERIDO: item.STCONFERIDO,
      VRTOTALPAGO: parseFloat(item.VRTOTALPAGO),
      VRTOTALDESCONTO: parseFloat(item.VRTOTALDESCONTO),
      VRTOTALVENDA: parseFloat(item.VRTOTALVENDA),
      STCONTINGENCIA: item.STCONTINGENCIA,
      TXTMOTIVOCANCELAMENTO: item.TXTMOTIVOCANCELAMENTO,
      contador
    };
  });

  const colunaVendasCanceladas = [
    {
      header: '*',
      body: row => row.contador,
      sortable: true,
      width: "5%"
    },
    {
      header: 'Caixa',
      body: row => row.IDCAIXAWEB + row.DSCAIXA,
      sortable: true,
    },
    {
      header: 'Nº Venda',
      body: row => row.IDVENDA,
      sortable: true,
    },
    {
      header: 'NFCe',
      body: row => row.NFE_INFNFE_IDE_NNF,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => dataFormatada(row.DTHORAFECHAMENTO),
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      header: 'Valor',
      body: row => formatMoeda(row.VRTOTALPAGO),
      sortable: true,
    },
    {
      header: 'Nota',
      body: row => (
        <div style={{color: row.STCONTINGENCIA == 'False' ? 'blue' : 'red'}}>
          {row.STCONTINGENCIA == 'False' ? 'Contigência' : 'Emitida'}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Motivo',
      body: row => row.TXTMOTIVOCANCELAMENTO,
      sortable: true,
    },
  
    {
      header: 'Opções',
      button: true,
      width: '10%',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between" }}
        >
          <div className="p-1">
            <ButtonProduto
              nome={"Produtos"}
              onClickProduto={() => handleClickProduto(row)}
            />
          </div>
          <div className="p-1">
            <ButtonVenda
              nome={"Vendas"}
              onClickVenda={() => handleClickVenda(row)}
            />
          </div>
          <div className="p-1">
            <ButtonPagamento
              nome={"Pagamentos"}
              onClickPagamento={() => handleClickPagamento(row)}
            />
          </div>
        </div>
      ),
    },

  ]

  // Fim Lista Vendas Canceladas

  // Fim Lista Vendas Convênio
  useEffect(() => {
    if (empresaSelecionada && datapesq) {
      getVendasConvenioDesconto(empresaSelecionada);
    }
  }, [empresaSelecionada])
  const getVendasConvenioDesconto = async (empresaSelecionada) => {
    try {
      if (handleClick()) {
        const formatData = dataFormatada(datapesq);
        // console.log(datapesq);
        const response = await get(`/resumoVendaConvenioDesc?idEmpresa=${empresaSelecionada}&dataInicio=${datapesq}&dataFechamento=${datapesq}`);
        if (response.data && response.data.length > 0) {
          setDadosVendasConvenioDesconto(response.data);
         
        }
        return response.data;
      }
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }
  const dadosConvenioVendasDesconto = dadosVendasConvenioDesconto.map((item, index) => {
    let contador = index + 1; 
    let vrTotalFaturaLoja = 0;
    vrTotalFaturaLoja + item.TOTALVENDAPROD;

    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOCONVENIADO: item.NOCONVENIADO,
      CPFCONVENIADO: item.CPFCONVENIADO,
      
      VRBRUTOPAGO: item.VRBRUTOPAGO,
      VRDESPAGO: item.VRDESPAGO,
      VRLIQPAGO: item.VRLIQPAGO,
      contador,
      vrTotalFaturaLoja
    };
  });

  const colunaVendasConvenioDesconto = [
    {
      header: '*',
      body: row => row.contador,
      sortable: true,
      width: "5%"
    },
    {
      header: 'Caixa ',
      body: row => row.IDCAIXAWEB + row.DSCAIXA,
      sortable: true,
    },
    {
      header: 'Nº Venda ',
      body: row => parseFloat(row.IDVENDA),
      sortable: true,
    },
    {
      header: 'NFCe ',
      body: row => row.NFE_INFNFE_IDE_NNF,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => dataFormatada(row.DTHORAFECHAMENTO),
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      header: 'Conveniado',
      body: row => row.NOCONVENIADO,
      sortable: true,
    },
    {
      header: 'CPF',
      body: row => row.CPFCONVENIADO,
      sortable: true,
    },
    {
      header: 'Valor Bruto',
      body: row => row.VRBRUTOPAGO,
      sortable: true,
    },
    {
      header: 'Desconto',
      body: row => row.VRDESPAGO,
      sortable: true,
    },
    {
      header: 'Valor Liq',
      body: row => row.VRLIQPAGO,
      sortable: true,
    },
    // {
    //   header: 'Situação',
    //   body: row => (
    //     <div style={{color: row.STCANCELADO == 'False' ? 'blue' : 'red'}}>
    //       {row.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}
        
    //     </div>
    //   ),
    //   sortable: true,
    // },

  ]

  // Fim Lista Vendas Convênio

  // Início Lista Vendas Com Desconto Funcionário
  useEffect(() => {
    if (empresaSelecionada && datapesq) {
      getVendasConvenioFuncionario(empresaSelecionada);
    }
  }, [empresaSelecionada])

  const getVendasConvenioFuncionario = async (empresaSelecionada) => {
    try {
      if (handleClick()) {
        const formatData = dataFormatada(datapesq);
        // console.log(datapesq);
        const response = await get(`/resumoVendaConvenioDesc?idEmpresa=${empresaSelecionada}&dataInicio=${datapesq}&dataFechamento=${datapesq}`);
        if (response.data && response.data.length > 0) {
          setDadosVendasConvenioDescontoFuncionario(response.data);
          console.log(response.data, 'Vendas Convenio');
        }
        return response.data;
      }
    } catch (error) {
      console.log(error, "não foi possível carregar os dados da tabela, lista Vendas vendedor");
    }

  }
  const dadosConvenioVendasDescontoFuncionario = dadosVendasConvenioDescontoFuncionario.map((item, index) => {
    let contador = index + 1; 
    let vrTotalFaturaLoja = 0;
    vrTotalFaturaLoja + item.TOTALVENDAPROD;

    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOCONVENIADO: item.NOCONVENIADO,
      CPFCONVENIADO: item.CPFCONVENIADO,
      
      VRBRUTOPAGO: item.VRBRUTOPAGO,
      VRDESPAGO: item.VRDESPAGO,
      VRLIQPAGO: item.VRLIQPAGO,
      contador,
      vrTotalFaturaLoja
    };
  });
  const colunaVendasConvenioDescontoFuncionario = [
    {
      header: '*',
      body: row => row.contador,
      sortable: true,
      width: "5%"
    },
    {
      header: 'Caixa ',
      body: row => row.IDCAIXAWEB + row.DSCAIXA,
      sortable: true,
    },
    {
      header: 'Nº Venda ',
      body: row => parseFloat(row.IDVENDA),
      sortable: true,
    },
    {
      header: 'NFCe ',
      body: row => row.NFE_INFNFE_IDE_NNF,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => dataFormatada(row.DTHORAFECHAMENTO),
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      header: 'Conveniado',
      body: row => row.NOCONVENIADO,
      sortable: true,
    },
    {
      header: 'CPF',
      body: row => row.CPFCONVENIADO,
      sortable: true,
    },
    {
      header: 'Valor Bruto',
      body: row => row.VRBRUTOPAGO,
      sortable: true,
    },
    {
      header: 'Desconto',
      body: row => row.VRDESPAGO,
      sortable: true,
    },
    {
      header: 'Valor Liq',
      body: row => row.VRLIQPAGO,
      sortable: true,
    },
    {
      header: 'Opções',
      body: row => (
        <div>
          <ButtonPagamento
            nome={"Pagamentos"}
            onClickPagamento={() => handleClickPagamento(row)}
          />
        
        </div>
      ),
      sortable: true,
    },

  ]
  // Fim Lista Vendas Com Desconto Funcionário

  const filtroEmpresa = (inputValue) => {
    console.log(empresas, "empresas fora de loadOptions")
    return empresas.filter((item) => 
      item.NOFANTASIA.toLowerCase().includes(inputValue.toLowerCase())
    )
  }
  const loadOptions = (inputValue, callback) => {
   setTimeout(() => {
  
     const filteredOptions = filtroEmpresa(inputValue);
     const options = filteredOptions.map((item) => ({
       value: item.IDEMPRESA,
       label: item.NOFANTASIA,
     }));
     callback(options);

   }, 1000)
  };


  const handleDateChange = (e) => {
    setDatapesq(e.target.value);
  };

  const handleSelectEmpresa = (e) => {
    const selectNome = e.target.value;
    const selectedId = Number(e.target.value);
    if (!isNaN(selectedId)) {
      setEmpresaSelecionada(selectedId);
    }
    setNomeEmpresaSelecionada(selectNome)
 
  }

  const handleClick = async () => {
    if(empresaSelecionada && datapesq) {

      setResumoVisivel(true)
      // getResumoVendas()
      setDatapesq(datapesq)
     
      // await getListaCaixaMovimento(empresaSelecionada)
      // await getListaCaixaFechados(empresaSelecionada)
    }

  }


  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    const totalPaginas = Math.ceil(dadosExemplos.length / itensPorPagina);
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const handlePaginaClicada = (pagina) => {
    setPaginaAtual(pagina);
  };

  const [dadosExemplos, setDadosExemplos] = useState([]);
  const [dadosVendasVendedor2, setDadosVendasVendedor2] = useState([]);
 
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = paginaAtual * itensPorPagina;


  const handleCloseModal = () => {
    setModalVisivel(false)
    setModalProdutoVisivel(false)
    setModalVendaVisivel(false)
    setModalPagamentoVisivel(false)
  }

  return (
    <Fragment>

      {actionVisivel && (
        <ActionMain
          title={"Dashboard Gerencia" }
          subTitle="Movimento de Caixa"
          linkComponentAnterior={["Home"]}
          linkComponent={["Tela Principal"]}
          InputSelectEmpresaComponent={InputSelectAction}
          onChangeSelectEmpresa={handleSelectEmpresa}
          valueSelectEmpresa={empresaSelecionada}

          optionsEmpresas={empresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))}
          labelSelectEmpresa={"Empresa"}

          InputFieldDTConsultaComponent={InputField}
          labelInputFieldDTConsulta="Data Consulta"
          valueDTCosulta={datapesq}
          onChangeInputFieldDTConsulta={handleDateChange}

          ButtonSearchComponent={ButtonSearch}
          linkNomeSearch={"Pesquisar"}
          onButtonClickSearch={handleClick}
        />

      )}

      {resumoVisivel && (

        <Fragment>
          <ResultadoResumo
            valorVendas={formatMoeda(totalRecebido)}
            valorTicketMedio={formatMoeda(totalTicketMedio)}
            valorDespesas="R$ 0,00"
            numeroCliente={`${qtdClientes}  0 `}
            nomeVendas="Vendas Loja"
            nomeClient="Clientes"
            nomeTicketMedio="Ticket Médio"
            nomeDespesas="Despesas"
            // valorEcommerce="R$ 0,00"
            // nomeEcommerce="Ecommerce"
            empresaUsuario={empresas}
            datapesq={datapesq}
          />
         
          {/* Lista de Caixas */}
          <ActionListaCaixa dadoCaixaLista={dadoCaixaLista}/>

          {/* Lista de pcj */}
          <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 >
                    Lista de Vendas PCJ
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">
                  <DataTable
                    columns={colunaVendasPCJ}
                    data={dadoCaixaLista}
                    responsive
                    pagination={itensPorPagina}
                    paginationPerPage={10}
                    subHeader
                    // subHeaderComponent={<SummaryFooter />}
                    customStyles={{
                      header: {
                        style: {
                          backgroundColor: '#f2f2f2',
                          color: '#7a59ad',
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: '#fbfbfb',

                          border: '0.1px solid #e9e9e9',
                          // borderRadius: '1px',
                          color: '#000',
                        },
                      },
                      pagination: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },

                    }}
                  />

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/*  Lista de Vendas Vendedor */}
          <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                    Lista de Vendas Vendedor
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">
                  <DataTable
                    columns={colunaVendidoVendedor}
                    data={dadosVendedorVendas}
                    responsive
                    pagination={itensPorPagina}
                    paginationPerPage={10}
                    subHeader
                    // subHeaderComponent={<SummaryFooter />}
                    customStyles={{
                      header: {
                        style: {
                          backgroundColor: '#f2f2f2',
                          color: '#7a59ad',
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: '#fbfbfb',

                          border: '0.1px solid #e9e9e9',
                          // borderRadius: '1px',
                          color: '#000',
                        },
                      },
                      pagination: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },

                    }}
                  />

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/*  Lista de Vendas Ativas */}
          <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                    Lista de Vendas Ativas
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">
                  <DataTable
                    columns={colunaVendasAtivas}
                    data={dadosAtivasVendas}
                    responsive
                    pagination={itensPorPagina}
                    paginationPerPage={10}
                    subHeader
                    // subHeaderComponent={<SummaryFooter />}
                    customStyles={{
                      header: {
                        style: {
                          backgroundColor: '#f2f2f2',
                          color: '#7a59ad',
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: '#fbfbfb',

                          border: '0.1px solid #e9e9e9',
                          // borderRadius: '1px',
                          color: '#000',
                        },
                      },
                      pagination: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },

                    }}
                  />

              
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {modalVendaVisivel && (
              <Modal
                show={modalVendaVisivel}
                onHide={handleCloseModal}
                size="lg"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"VENDA Nº " + dadosVendasCanceladaModal[0].IDVENDA}
                    // subTitle={""}
                    handleClose={handleCloseModal}
                  />
                  <header className="modal-header">
                    <div>

                      <p style={{ fontWeight: 500 }}>Operador: <b> {dadosVendasCanceladaModal[0].NOFUNCIONARIO} </b></p>
                      <p style={{ fontWeight: 500 }}>Cliente: <b>{dadosVendasCanceladaModal[0].NOFUNDESCONTO != null && dadosVendasCanceladaModal[0].NOFUNDESCONTO != '' ? dadosVendasCanceladaModal[0].NOFUNDESCONTO : 'Consumidor Final'} </b></p>
                      <p style={{ fontWeight: 500 }}>CPF: <b>{dadosVendasCanceladaModal[0].DEST_CPF === '' ? 'Não Informado' : dadosVendasCanceladaModal[0].DEST_CPF}</b></p>
                    </div>
                  </header>
                  <Modal.Body>
                    <div class="form-group">
                      <div class="row mt-2">

                        <div class="col-sm-6 col-xl-6">
                          <label class="form-label" for="empresa">Empresa</label>
                          {/* {console.log(dadosVendasCanceladaModal, "NOFANTASIA")} */}
                          <InputFieldModal type="text" class="form-control input" value={dadosVendasCanceladaModal[0].NOFANTASIA} readOnly />
                        </div>

                        <div class="col-sm-6 col-xl-4">
                          <label class="form-label" for="nmovcaix">Nº Mov. Caixa</label>
                          <InputFieldModal type="text" class="form-control input" value={dadosVendasCanceladaModal[0].IDMOVIMENTOCAIXAWEB} readOnly />
                        </div>

                        <div class="col-sm-6 col-xl-2">
                          <label class="form-label" for="nnotavenda">Nota Nº</label>
                          <InputFieldModal type="text" id="idnumnota" name="idnumnota" class="form-control input" value="" readOnly />
                        </div>
                      </div>


                      <div className="form-group">

                        <div class="row mt-2">
                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="dtabert">Data Abertura</label>
                            <InputFieldModal type="text" class="form-control" value={dataFormatada(dadosVendasCanceladaModal[0].DTHORAABERTURA)} readOnly />
                          </div>

                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="dtfech">Data Fechamento</label>
                            <InputFieldModal type="text" class="form-control" value={dataFormatada(dadosVendasCanceladaModal[0].DTHORAFECHAMENTO)} readOnly />
                          </div>

                          <div class="col-sm-6 col-xl-6">
                            <label class="form-label" for="chnota">Chave da Nota</label>
                            <InputFieldModal type="text" id="ChNota" name="ChNota" class="form-control" value="" readOnly />
                          </div>

                        </div>
                      </div>

                      <div class="row mt-2">
                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrvenda">Valor Venda</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].VRTOTALVENDA)} readOnly />
                        </div>
                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrbrutonota">Valor Bruto Nota</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].NFE_INFNFE_TOTAL_ICMSTOT_VPROD)} readOnly />
                        </div>

                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrdescnota">Valor Desc Nota</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].NFE_INFNFE_TOTAL_ICMSTOT_VDESC)} readOnly />

                        </div>
                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrnota">Valor Nota</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].VRTOTALPAGO)} readOnly />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="row mt-2">

                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="idcupompromocao">Nº Cupom</label>
                            <InputFieldModal type="text" id="idcupompromocao" name="idcupompromocao" class="form-control input" value="0" readOnly />
                          </div>
                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="idvendaorigem">Venda Origem</label>
                            <InputFieldModal type="text" id="idvendaorigem" name="idvendaorigem" class="form-control input" value="0" readOnly />
                          </div>

                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="idvendadestino">Venda Destino</label>
                            <InputFieldModal type="text" id="idvendadestino" name="idvendadestino" class="form-control input" value="0" readOnly />
                          </div>
                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="vrdesccupom">Valor Desconto</label>
                            <InputFieldModal type="text" id="vrdesccupom" name="vrdesccupom" class="form-control input" value="0" readOnly />
                          </div>
                        </div>

                      </div>

                      <div class="row mt-2">

                        <div class="col-sm-6 col-xl-12" id="2" >
                          <label class="form-label" for="mcancvenda">Motivo Cancelamento da Venda</label>
                          <InputFieldModal type="text" id="MotCancelVenda" name="MotCancelVenda" class="form-control input" value={dadosVendasCanceladaModal[0].TXTMOTIVOCANCELAMENTO} readOnly />
                        </div>
                      </div>
                    </div>


                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>
            )}

            {modalPagamentoVisivel && (
              <Modal
                show={modalPagamentoVisivel}
                onHide={handleCloseModal}
                size="lg"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"Detalhe da Venda"}
                    subTitle={"Relação de Recebimentos da Venda"}
                    handleClose={handleCloseModal}
                  />

                  <Modal.Body>
                
                    <DataTable
                      // title={`Lista de Produtos da Venda Nº  ${dadosPagamentos[0].IDVENDA} `}
                      title={`Lista de Produtos da Venda Nº  ${dadosPagamentos} `}
                      columns={colunasPagamento}
                      data={dadosPagamentos}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />

                    <div className="mt-4">

                    <DataTable
                      
                      columns={colunasPagPos}
                      data={dadosPagamentos}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />
                    </div>
                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>

            )}

            {modalVisivel && (

              <Modal
                show={modalVisivel}
                onHide={handleCloseModal}
                size="lg"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"Detalhe da Venda"}
                    subTitle={"Relação de Recebimentos da Venda "}
                    handleClose={handleCloseModal}
                  />

                  <Modal.Body>

                    <DataTable
                      title="Lista de Recebimentos da Venda Nº"
                      columns={colunasVouchers}
                      data={dados}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />
                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>
            )}

            {modalProdutoVisivel && (
              <Modal
                show={modalProdutoVisivel}
                onHide={handleCloseModal}
                size="xl"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"Detalhe da Venda"}
                    subTitle={"Relação de Produtos da Venda "}
                    handleClose={handleCloseModal}
                  />

                  <Modal.Body>

                    <DataTable
                      title="Lista de Recebimentos da Venda Nº"
                      columns={colunasProdutoModal}
                      data={dadosModalProduto}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />
                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>
            )}
          </div>

          {/*  Lista de Vendas Canceladas */}
          <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                    Lista de Vendas Canceladas
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">
                  <DataTable
                    columns={colunaVendasCanceladas}
                    data={dadosCanceladasVendas}
                    responsive
                    pagination={itensPorPagina}
                    paginationPerPage={10}
                    subHeader
                    // subHeaderComponent={<SummaryFooter />}
                    customStyles={{
                      header: {
                        style: {
                          backgroundColor: '#f2f2f2',
                          color: '#7a59ad',
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: '#fbfbfb',

                          border: '0.1px solid #e9e9e9',
                          // borderRadius: '1px',
                          color: '#000',
                        },
                      },
                      pagination: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },

                    }}
                  />

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {modalVendaVisivel && (
              <Modal
                show={modalVendaVisivel}
                onHide={handleCloseModal}
                size="lg"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"VENDA Nº " + dadosVendasCanceladaModal[0].IDVENDA}
                    // subTitle={""}
                    handleClose={handleCloseModal}
                  />
                  <header className="modal-header">
                    <div>

                      <p style={{ fontWeight: 500 }}>Operador: <b> {dadosVendasCanceladaModal[0].NOFUNCIONARIO} </b></p>
                      <p style={{ fontWeight: 500 }}>Cliente: <b>{dadosVendasCanceladaModal[0].NOFUNDESCONTO != null && dadosVendasCanceladaModal[0].NOFUNDESCONTO != '' ? dadosVendasCanceladaModal[0].NOFUNDESCONTO : 'Consumidor Final'} </b></p>
                      <p style={{ fontWeight: 500 }}>CPF: <b>{dadosVendasCanceladaModal[0].DEST_CPF === '' ? 'Não Informado' : dadosVendasCanceladaModal[0].DEST_CPF}</b></p>
                    </div>
                  </header>
                  <Modal.Body>
                    <div class="form-group">
                      <div class="row mt-2">

                        <div class="col-sm-6 col-xl-6">
                          <label class="form-label" for="empresa">Empresa</label>
                          {/* {console.log(dadosVendasCanceladaModal, "NOFANTASIA")} */}
                          <InputFieldModal type="text" class="form-control input" value={dadosVendasCanceladaModal[0].NOFANTASIA} readOnly />
                        </div>

                        <div class="col-sm-6 col-xl-4">
                          <label class="form-label" for="nmovcaix">Nº Mov. Caixa</label>
                          <InputFieldModal type="text" class="form-control input" value={dadosVendasCanceladaModal[0].IDMOVIMENTOCAIXAWEB} readOnly />
                        </div>

                        <div class="col-sm-6 col-xl-2">
                          <label class="form-label" for="nnotavenda">Nota Nº</label>
                          <InputFieldModal type="text" id="idnumnota" name="idnumnota" class="form-control input" value="" readOnly />
                        </div>
                      </div>


                      <div className="form-group">

                        <div class="row mt-2">
                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="dtabert">Data Abertura</label>
                            <InputFieldModal type="text" class="form-control" value={dataFormatada(dadosVendasCanceladaModal[0].DTHORAABERTURA)} readOnly />
                          </div>

                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="dtfech">Data Fechamento</label>
                            <InputFieldModal type="text" class="form-control" value={dataFormatada(dadosVendasCanceladaModal[0].DTHORAFECHAMENTO)} readOnly />
                          </div>

                          <div class="col-sm-6 col-xl-6">
                            <label class="form-label" for="chnota">Chave da Nota</label>
                            <InputFieldModal type="text" id="ChNota" name="ChNota" class="form-control" value="" readOnly />
                          </div>

                        </div>
                      </div>

                      <div class="row mt-2">
                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrvenda">Valor Venda</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].VRTOTALVENDA)} readOnly />
                        </div>
                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrbrutonota">Valor Bruto Nota</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].NFE_INFNFE_TOTAL_ICMSTOT_VPROD)} readOnly />
                        </div>

                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrdescnota">Valor Desc Nota</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].NFE_INFNFE_TOTAL_ICMSTOT_VDESC)} readOnly />

                        </div>
                        <div class="col-sm-6 col-xl-3">
                          <label class="form-label" for="vrnota">Valor Nota</label>
                          <InputFieldModal type="text" class="form-control input" value={formatMoeda(dadosVendasCanceladaModal[0].VRTOTALPAGO)} readOnly />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="row mt-2">

                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="idcupompromocao">Nº Cupom</label>
                            <InputFieldModal type="text" id="idcupompromocao" name="idcupompromocao" class="form-control input" value="0" readOnly />
                          </div>
                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="idvendaorigem">Venda Origem</label>
                            <InputFieldModal type="text" id="idvendaorigem" name="idvendaorigem" class="form-control input" value="0" readOnly />
                          </div>

                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="idvendadestino">Venda Destino</label>
                            <InputFieldModal type="text" id="idvendadestino" name="idvendadestino" class="form-control input" value="0" readOnly />
                          </div>
                          <div class="col-sm-6 col-xl-3">
                            <label class="form-label" for="vrdesccupom">Valor Desconto</label>
                            <InputFieldModal type="text" id="vrdesccupom" name="vrdesccupom" class="form-control input" value="0" readOnly />
                          </div>
                        </div>

                      </div>

                      <div class="row mt-2">

                        <div class="col-sm-6 col-xl-12" id="2" >
                          <label class="form-label" for="mcancvenda">Motivo Cancelamento da Venda</label>
                          <InputFieldModal type="text" id="MotCancelVenda" name="MotCancelVenda" class="form-control input" value={dadosVendasCanceladaModal[0].TXTMOTIVOCANCELAMENTO} readOnly />
                        </div>
                      </div>
                    </div>


                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>
            )}

            {modalPagamentoVisivel && (
              <Modal
                show={modalPagamentoVisivel}
                onHide={handleCloseModal}
                size="lg"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"Detalhe da Venda"}
                    subTitle={"Relação de Recebimentos da Venda"}
                    handleClose={handleCloseModal}
                  />

                  <Modal.Body>
                
                    <DataTable
                      // title={`Lista de Produtos da Venda Nº  ${dadosPagamentos[0].IDVENDA} `}
                      title={`Lista de Produtos da Venda Nº  ${dadosPagamentos} `}
                      columns={colunasPagamento}
                      data={dadosPagamentos}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />

                    <div className="mt-4">

                    <DataTable
                      
                      columns={colunasPagPos}
                      data={dadosPagamentos}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />
                    </div>
                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>

            )}

            {modalVisivel && (

              <Modal
                show={modalVisivel}
                onHide={handleCloseModal}
                size="lg"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"Detalhe da Venda"}
                    subTitle={"Relação de Recebimentos da Venda "}
                    handleClose={handleCloseModal}
                  />

                  <Modal.Body>

                    <DataTable
                      title="Lista de Recebimentos da Venda Nº"
                      columns={colunasVouchers}
                      data={dados}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />
                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>
            )}

            {modalProdutoVisivel && (
              <Modal
                show={modalProdutoVisivel}
                onHide={handleCloseModal}
                size="xl"
                className="modal fade"

                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >

                <div className="" role="document">

                  <HeaderModal
                    title={"Detalhe da Venda"}
                    subTitle={"Relação de Produtos da Venda "}
                    handleClose={handleCloseModal}
                  />

                  <Modal.Body>

                    <DataTable
                      title="Lista de Recebimentos da Venda Nº"
                      columns={colunasProdutoModal}
                      data={dadosModalProduto}
                      responsive
                      pagination={itensPorPagina}
                      paginationPerPage={10}
                      customStyles={{
                        header: {
                          style: {
                            backgroundColor: '#f2f2f2',
                            color: '#7a59ad',
                          },
                        },
                        headCells: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },
                        cells: {
                          style: {
                            backgroundColor: '#fbfbfb',

                            border: '0.1px solid #e9e9e9',
                            // borderRadius: '1px',
                            color: '#000',
                          },
                        },
                        pagination: {
                          style: {
                            backgroundColor: '#7a59ad',
                            color: 'white',
                          },
                        },

                      }}
                    />
                  </Modal.Body>

                  <FooterModal
                    handleClose={handleCloseModal}
                  />
                </div>
              </Modal>
            )}
          </div>

          {/*  Lista de Vendas Convênio Desconto em Folha */}
          <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                    Lista de Vendas Convênio Desconto em Folha 
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">
                  <DataTable
                    columns={colunaVendasConvenioDesconto}
                    data={dadosConvenioVendasDesconto}
                    responsive
                    pagination={itensPorPagina}
                    paginationPerPage={10}
                    subHeader
                    // subHeaderComponent={<SummaryFooter />}
                    customStyles={{
                      header: {
                        style: {
                          backgroundColor: '#f2f2f2',
                          color: '#7a59ad',
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: '#fbfbfb',

                          border: '0.1px solid #e9e9e9',
                          // borderRadius: '1px',
                          color: '#000',
                        },
                      },
                      pagination: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },

                    }}
                  />

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

           {/* Lista de Vendas Com Desconto Funcionários e PN */}
           <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                  Lista de Vendas Com Desconto Funcionários e PN
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">
                  <DataTable
                    columns={colunaVendasConvenioDescontoFuncionario}
                    data={dadosConvenioVendasDescontoFuncionario}
                    responsive
                    pagination={itensPorPagina}
                    paginationPerPage={10}
                    subHeader
                    // subHeaderComponent={<SummaryFooter />}
                    customStyles={{
                      header: {
                        style: {
                          backgroundColor: '#f2f2f2',
                          color: '#7a59ad',
                        },
                      },
                      headCells: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: '#fbfbfb',

                          border: '0.1px solid #e9e9e9',
                          // borderRadius: '1px',
                          color: '#000',
                        },
                      },
                      pagination: {
                        style: {
                          backgroundColor: '#7a59ad',
                          color: 'white',
                        },
                      },

                    }}
                  />

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

        </Fragment>
      )}

    </Fragment>
  )
}

//  2620 linhas antes de refatorar