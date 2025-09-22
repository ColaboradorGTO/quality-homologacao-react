import { Fragment, useEffect, useRef, useState } from "react";
import { get } from "../../../../api/funcRequest";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { GrView } from "react-icons/gr";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { mascaraValor } from "../../../../utils/mascaraValor";
import { ActionVendaRecebimentoModal } from "../ActionModaisVendas/actionVendaRecebimentoModal";

export const ActionListaRecebimentosLoja = ({
  dadosRecebimentosEletronico, 
  dadosListaRecebimentosLoja, 
  empresaSelecionada, 
  dataPesquisaInicio, 
  dataPesquisaFim
}) => {
  const [modalDetalheRecebimento, setModalDetalheRecebimento] = useState(false);
  const [dadosDetalheRecebimentosEletronico, setDadosDetalheRecebimentosEletronico] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Detalhamento TEF E POS',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nome', 'Forma Pag', 'Valor', 'QTD Cupons', '% Venda']],
      body: dados.map(item => [
        item.NOTEF,
        item.DSTIPOPAGAMENTO,
        formatMoeda(item.VALORRECEBIDO),
        parseFloat(item.QTDPGTOS),
        parseFloat(item.percentualVrRecebido).toFixed(2)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('recebimento_tef.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas PIX Compensação');
    const header = ['Nome', 'Forma de Pagamento', 'Valor', 'QTD Cupons', '% Venda'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nome' },
      { wpx: 150, caption: 'Forma de Pagamento' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'QTD Cupons' },
      { wpx: 100, caption: '% Venda' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhamento TEF E POS');
    XLSX.writeFile(workbook, 'recebimento_tef.xlsx');
  };

  const calcularTotalValorRecebidoLoja = (item) => {
    return (
      toFloat(item.VALORTOTALDINHEIRO) +
      toFloat(item.VALORTOTALCARTAO) +
      toFloat(item.VALORTOTALCONVENIO) +
      toFloat(item.VRPOS) +
      toFloat(item.VALORTOTALVOUCHER) +
      toFloat(item.VRPIX) +
      toFloat(item.VRMOOVPAY)
    );
  };

  const calcularTotalValorRecebido = () => {
    return dadosListaRecebimentosLoja.reduce((total, item) => total + calcularTotalValorRecebidoLoja(item), 0);
  };

  const calcularTotalQuantidadePagamentos = () => {
    return dadosRecebimentosEletronico.reduce((total, item) => total + parseFloat(item.QTDPGTOS), 0);
  };

  const dadosExcel = Array.isArray(dadosRecebimentosEletronico) ? dadosRecebimentosEletronico.map((item) => {
    const percentualVrRecebido = ((parseFloat(item.VALORRECEBIDO) * 100) / calcularTotalValorRecebido()).toFixed(2);

    return {
      NOTEF: item.NOTEF,
      DSTIPOPAGAMENTO: `${item.DSTIPOPAGAMENTO} x ${item.NPARCELAS}`,
      VALORRECEBIDO: item.VALORRECEBIDO,
      QTDPGTOS: item.QTDPGTOS,
      percentualVrRecebido,
    };
  }): []

  const dados = dadosRecebimentosEletronico.map((item) => {
    const percentualVrRecebido = ((parseFloat(item.VALORRECEBIDO) * 100) / calcularTotalValorRecebido()).toFixed(2);

    return {
      NOTEF: item.NOTEF,
      NPARCELAS: item.NPARCELAS,
      DSTIPOPAGAMENTO: `${item.DSTIPOPAGAMENTO} x ${item.NPARCELAS}`,
      VALORRECEBIDO: item.VALORRECEBIDO,
      QTDPGTOS: item.QTDPGTOS,
      NOAUTORIZADOR: item.NOAUTORIZADOR,
      percentualVrRecebido,
    };
  })

  const colunasRecebimento = [
    {
      field: 'NOTEF',
      header: 'Nome',
      body: row => <th>{row.NOTEF}</th>,
      sortable: true,
    },
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Forma de Pagamento',
      body: row => <th>{row.DSTIPOPAGAMENTO} </th>,
      footer: 'Total',
      sortable: true,
    },
    {
      field: 'VALORRECEBIDO',
      header: 'Valor',
      body: row => <th>{formatMoeda(row.VALORRECEBIDO)}</th>,
      footer: formatMoeda(calcularTotalValorRecebido()),
      sortable: true,
    },
    {
      field: 'QTDPGTOS',
      header: 'Qtd Cupons',
      body: row => <th>{parseFloat(row.QTDPGTOS)}</th>,
      footer: calcularTotalQuantidadePagamentos(),
      sortable: true,
    },
    {
      field: 'percentualVrRecebido',
      header: '% Venda',
      body: row => <th>{mascaraValor(row.percentualVrRecebido)}</th>,
      sortable: true,
    },
    {
      field: '',
      header: 'Detalhar',
      body: row => {
        return (
          <ButtonTable
            onClickButton={() => handleClickEditar(row)}
            titleButton={'Detalhar'}
            Icon={GrView}
            cor="success"
            width="35px"
            height="35px"
            iconSize={25}

          />
        );
      },
    },
  ];

  const handleEditar = async (NOAUTORIZADOR, NPARCELAS, NOTEF) => {
    try {
      const response = await get(`/venda-detalhe-recebimento-eletronico?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&nomeTef=${NOTEF}&nomeAutorizador=${NOAUTORIZADOR}&numeroParcelas=${NPARCELAS}`);

      if (response.data && response.data.length ) {
        setModalDetalheRecebimento(true);
        setDadosDetalheRecebimentosEletronico(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };

  const handleClickEditar = (row) => {
    if (row && row.NOAUTORIZADOR && row.NPARCELAS && row.NOTEF) {
      handleEditar(row.NOAUTORIZADOR, row.NPARCELAS, row.NOTEF);
    }
  };

  return (
    <Fragment>
      <div className="panel" >
        <div className="panel-hdr p-2">
          <h2 style={{  textAlign: 'center', fontWeight: 600 }}>Recebimentos Lojas</h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />
        </div>
        <div className="card" ref={dataTableRef}>
          <DataTable
            title="Lista Recebimentos Eletronico "
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortField="VALORRECEBIDO"
            sortOrder={-1}
            rows={dados.length}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasRecebimento.map(coluna => (
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

        <ActionVendaRecebimentoModal 
          show={modalDetalheRecebimento}
          handleClose={() => setModalDetalheRecebimento(false)}
          dadosDetalheRecebimentosEletronico={dadosDetalheRecebimentosEletronico}
        />
      </div>
    </Fragment>
  );
};