import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../utils/dataFormatada";
import { formatMoeda } from "../../utils/formatMoeda";
import { GrView } from "react-icons/gr";
import { FaProductHunt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { ButtonTable } from "../ButtonsTabela/ButtonTable";
import { get } from "../../api/funcRequest";
// import { AdministrativoActionDetalheVendaModal } from "./actionDetalheVendaModal";
// import { AdministrativoActionDetalheRecebimentoModal } from "./Components/ActionVendasContigencia/actionDetalheRecebimentoModal";
// import { AdministrativoActionDetalheVendaProdutoModal } from "./Components/ActionVendasContigencia/actionDetalheVendaProdutoModal";


export const AdministrativoActionPesquisaVendasCanceladasEmpresa = ({ dadosVendasCanceladas }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalVendaVisivel, setModalVendaVisivel] = useState(false);
  const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false);
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
  const [dadosVendasCanceladaModal, setDadosVendasCanceladaModal] = useState([]);
  const [dadosProdutoModal, setDadosProdutoModal] = useState([]);
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([]);


  const calcularTotalValorDinheiro = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladas) {
      total += parseFloat(dados.VRRECDINHEIRO)
    }
    return total;
  }

  const calcularTotalValorCartao = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladas) {
      total += parseFloat(dados.VRRECCARTAO)
    }
    return total;
  }

  const calcularTotalValorConvenio = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladas) {
      total += parseFloat(dados.VRRECCONVENIO)
    }
    return total;
  }

  const calcularTotalValorPos = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladas) {
      total += parseFloat(dados.VRRECPOS)
    }
    return total;
  }

  const calcularTotalValorVoucher = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladas) {
      total += parseFloat(dados.VRRECVOUCHER)
    }
    return total;
  }

  const calcularTotalValorVenda = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladas) {
      total += parseFloat(dados.VRTOTALVENDA)
    }
    return total;
  }

  const dadosListaVendasCanceladas = dadosVendasCanceladas.map((item, index) => {
    let contador = index + 1;

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

      VRRECDINHEIRO: item.VRRECDINHEIRO,
      VRRECCARTAO: item.VRRECCARTAO,
      VRRECCONVENIO: item.VRRECCONVENIO,
      VRRECPOS: item.VRRECPOS,
      VRRECVOUCHER: item.VRRECVOUCHER,
      VRTOTALPAGO: item.VRTOTALPAGO,
      VRTOTALVENDA: item.VRTOTALVENDA,
      STCONTINGENCIA: item.STCONTINGENCIA,

      contador
    }
  });

  const colunasVendasCanceladas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p style={{ color: 'blue' }}> {row.contador}</p>,
      sortable: true,
      width: '3%',
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ color: 'blue' }}> {row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DSCAIXA',
      header: 'Caixa',
      body: row => <p style={{ color: 'blue' }}> {row.DSCAIXA}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <p style={{ color: 'blue' }}> {row.IDVENDA}</p>,
      sortable: true,

    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFE/NFCe',
      body: row => <p style={{ color: 'blue' }}> {row.NFE_INFNFE_IDE_NNF}</p>,
      sortable: true,

    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => <p style={{ color: 'blue' }}> {dataFormatada(row.DTHORAFECHAMENTO)}</p>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <p style={{ color: 'blue' }}> {row.NOFUNCIONARIO}</p>,
      sortable: true,
    },
    {
      field: 'VRRECDINHEIRO',
      header: 'Vr.Dinheiro',
      body: row => <p style={{ color: 'blue' }}> {formatMoeda(row.VRRECDINHEIRO)}</p>,
      footer: () => {
        return (
          <p> Total Dinheiro: {formatMoeda(calcularTotalValorDinheiro())} </p>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECCARTAO',
      header: 'Vr.Cartão',
      body: row => <p style={{ color: 'blue' }}> {formatMoeda(row.VRRECCARTAO)}</p>,
      footer: () => {
        return (
          <p> Total Cartão: {formatMoeda(calcularTotalValorCartao())} </p>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECCONVENIO',
      header: 'Vr.Convênio',
      body: row => <p style={{ color: 'blue' }}> {formatMoeda(row.VRRECCONVENIO)}</p>,
      footer: () => {
        return (
          <p> Total Convênio: {formatMoeda(calcularTotalValorConvenio())} </p>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECPOS',
      header: 'Vr.POS',
      body: row => <p style={{ color: 'blue' }}> {formatMoeda(row.VRRECPOS)}</p>,
      footer: () => {
        return (
          <p> Total POS: {formatMoeda(calcularTotalValorPos())} </p>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Vr.Voucher',
      body: row => <p style={{ color: 'blue' }}> {formatMoeda(row.VRRECVOUCHER)}</p>,
      footer: () => {
        return (
          <p> Total Voucher: {formatMoeda(calcularTotalValorVoucher())} </p>
        )
      },
      sortable: true,
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Vr.Venda',
      body: row => <p style={{ color: 'blue' }}> {formatMoeda(row.VRTOTALVENDA)}</p>,
      footer: () => {
        return (
          <p> Total Pago: {formatMoeda(calcularTotalValorVenda())} </p>
        )
      },
      sortable: true,
    },
    {
      field: 'STCONTINGENCIA',
      header: 'ST Nota',
      body: (row) => {
        if (row.STCONTINGENCIA == 'False' && row.VRTOTALVENDA > 0) {
          return (
            <p style={{ color: 'blue' }}> {row.STCONTINGENCIA = 'Contigência'}</p>
          )
        } if (row.STCONTINGENCIA = row.VRTOTALVENDA > 0) {
          return (
            <p style={{ color: 'blue' }}> {row.STCONTINGENCIA ? 'Emitida' : 'Não Emitida'}</p>
          )
        }
      },
      sortable: true,

    },
    {
      field: 'NOFUNCIOCANCEL',
      header: 'Cancelado Por',
      body: row => <p style={{ color: 'blue' }}> {row.NOFUNCIOCANCEL}</p>,
      sortable: true,
    },
    {
      field: 'NOFUNCAOCANCEL',
      header: 'Função',
      body: row => <p style={{ color: 'blue' }}> {row.NOFUNCAOCANCEL}</p>,
      sortable: true,
    },
    {
      field: 'TXTMOTIVOCANCELAMENTO',
      header: 'Motivo',
      body: row => <p style={{ color: 'blue' }}> {row.TXTMOTIVOCANCELAMENTO}</p>,
      sortable: true,

    },
    {
      field: 'IDVENDA',
      header: 'Opções',
      // width: '250px',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Venda"}
              onClickButton={() => handleClickVenda(row)}
              Icon={GrView}
              cor={"info"}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Produtos"}
              onClickButton={() => handleClickProduto(row)}
              Icon={FaProductHunt}
              cor={"warning"}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Recebimentos"}
              onClickButton={() => handleClickPagamento(row)}
              Icon={MdOutlineAttachMoney}
              cor={"success"}
            />
          </div>
        </div>
      ),
    },
  ]

  const handleEditProduto = async (IDVENDA) => {
    try {
      const response = await get(`/detalheVenda?idEmpresa=0&idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosProdutoModal(response.data)
        setModalProdutoVisivel(true)

      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickProduto = async (row) => {
    if (row.IDVENDA) {
      handleEditProduto(row.IDVENDA)
    }
  }

  useEffect(() => {
    if (modalProdutoVisivel) {
      handleClickProduto()
    }
  }, [modalProdutoVisivel])


  const handleClickVenda = async (row) => {
    if (row.IDVENDA) {
      handleEditVenda(row.IDVENDA)
    }
  }

  const handleEditVenda = async (IDVENDA) => {

    try {
      const response = await get(`/resumo-venda-caixa-detalhado?idEmpresa=0&idVenda=${IDVENDA}`)
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
      const response = await get(`/recebimento?idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosPagamentoModal(response.data)
        setModalPagamentoVisivel(true)
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }
  const handleClickPagamento = (row) => {
    if (row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }

  const handleCloseModal = () => {
    setModalVisivel(false)
    setModalProdutoVisivel(false)
    setModalVendaVisivel(false)
    setModalPagamentoVisivel(false)
  }


  return (

    <Fragment>

      <div id="card">

        <DataTable
          title="Vendas por Loja"
          value={dadosListaVendasCanceladas}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasVendasCanceladas.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}

              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
      </div>

      {/* {modalVendaVisivel && (

        <AdministrativoActionDetalheVendaModal
          show={modalVendaVisivel}
          handleClose={handleCloseModal}
          dadosVendasCanceladaModal={dadosVendasCanceladaModal}
        />
      )}

      {modalPagamentoVisivel && (
        <AdministrativoActionDetalheRecebimentoModal
          show={modalPagamentoVisivel}
          handleClose={handleCloseModal}
          dadosPagamentoModal={dadosPagamentoModal}
        />

      )}

      {modalProdutoVisivel && (

        <AdministrativoActionDetalheVendaProdutoModal
          show={modalProdutoVisivel}
          handleClose={handleCloseModal}
          dadosProdutoModal={dadosProdutoModal}
        />
      )} */}
    </Fragment>
  )
}

