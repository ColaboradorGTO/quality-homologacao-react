import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasPorVendedor  = ({dadosVendasVendedor}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);

  
  const onPageChange = (event) => {
      setFirst(event.first);
      setRows(event.rows);
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas por Vendedor',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Matrícula', 'Funcionário', 'QTD Vendas', 'QTD Produtos', 'Valor Total Vendas', 'Valor Total Venda Liq', 'Valor Total Custo' ]],
      body: dadosListaVendedorVendas.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.VENDEDOR_MATRICULA,
        item.VENDEDOR_NOME,
        item.QTD_VENDAS,
        item.QTD_PRODUTOS,
        formatMoeda(item.VRTOTALVENDA),
        formatMoeda(item.VRRECVOUCHER),
        formatMoeda(item.valorTotalVendaLiquida),
        formatMoeda(item.PRECO_COMPRA)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_vendedor.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosListaVendedorVendas);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Matrícula', 'Funcionário', 'QTD Vendas', 'QTD Produtos', 'Valor Total Vendas', 'Valor Total Venda Liq', 'Valor Total Custo' ]
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 100, caption: 'Funcionário' },
      { wpx: 100, caption: 'QTD Vendas' },
      { wpx: 100, caption: 'QTD Produtos' },
      { wpx: 100, caption: 'Valor Total Vendas' },
      { wpx: 100, caption: 'Valor Total Venda Liq' },
      { wpx: 100, caption: 'Valor Total Custo' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
    XLSX.writeFile(workbook, 'vendas_vendedor.xlsx');
  };


  const calcularValorTotalVendaLiquida = (item) => {
    
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRRECVOUCHER)
  }

  const calcularTotalQuantidadeVendas = () => {
    let total = 0;
    for(let dados of dadosVendasVendedor) {
      total += parseFloat(dados.QTD_VENDAS);
    }
    return total;
  }

  const calcularTotalQuantidadeVendasPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for(let i = firstIndex; i < lastIndex && i < dadosVendasVendedor.length; i++) {
      if(dadosVendasVendedor[i]) {
        total += parseFloat(dadosVendasVendedor[i].QTD_VENDAS);
      }
    }
    return total;
  }

  const calcularTotalQuantidadeProdutos = () => {
    let total = 0;
    for(let dados of dadosVendasVendedor) {
      total += parseFloat(dados.QTD_PRODUTOS)
    }
    return total;
  }

  const calcularTotalQuantidadeProdutosPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for(let i = firstIndex; i < lastIndex && i < dadosVendasVendedor.length; i++) {
      if(dadosVendasVendedor[i]) {
        total += parseFloat(dadosVendasVendedor[i].QTD_PRODUTOS);
      }
    }
    return total;
  }

  const calcularTotalVendaBrutaVendasVendedor = () => {
    let total = 0;
    for(let dados of dadosVendasVendedor) {
      total += parseFloat(dados.VRTOTALVENDA);
    }
    return total;
  }

  const calcularTotalVendaBrutaVendasVendedorPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for(let i = firstIndex; i < lastIndex && i < dadosVendasVendedor.length; i++) {
      if(dadosVendasVendedor[i]) {
        total += parseFloat(dadosVendasVendedor[i].VRTOTALVENDA);
      }
    }
    return total;
  }

  const calcularTotalValorVoucher = () => {
    let total = 0;
    for(let dados of dadosVendasVendedor) {
      total += parseFloat(dados.VRRECVOUCHER);
    }
    return total;
  }

  const calcularTotalValorVoucherPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for(let i = firstIndex; i < lastIndex && i < dadosVendasVendedor.length; i++) {
      if(dadosVendasVendedor[i]) {
        total += parseFloat(dadosVendasVendedor[i].VRRECVOUCHER);
      }
    }
    return total;
  }

  const calcularTotalVendaLiquidaVendasVendedor = () => {
    let total = 0;
    for(let dados of dadosListaVendedorVendas) {
      total += parseFloat(dados.valorTotalVendaLiquida);
    }
    return total;
  }

  const calcularTotalVendaLiquidaVendasVendedorPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for(let i = firstIndex; i < lastIndex && i < dadosListaVendedorVendas.length; i++) {
      if(dadosListaVendedorVendas[i]) {
        total += parseFloat(dadosListaVendedorVendas[i].valorTotalVendaLiquida);
      }
    }
    return total;
  }

  const calcularTotalValorCusto = () => {
    let total = 0;
    for(let dados of dadosVendasVendedor) {
      total += parseFloat(dados.PRECO_COMPRA);
    }
    return total;
  }

  const calcularTotalValorCustoPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for(let i = firstIndex; i < lastIndex && i < dadosVendasVendedor.length; i++) {
      if(dadosVendasVendedor[i]) {
        total += parseFloat(dadosVendasVendedor[i].PRECO_COMPRA);
      }
    }
    return total;
  }

  const dadosListaVendedorVendas = dadosVendasVendedor.map((item, index) => {
    let contador = index + 1;
    const valorTotalVendaLiquida = calcularValorTotalVendaLiquida(item);
    
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      VENDEDOR_MATRICULA: item.VENDEDOR_MATRICULA,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      QTD_VENDAS: item.QTD_VENDAS,
      QTD_PRODUTOS: item.QTD_PRODUTOS,
      VRTOTALVENDA: item.VRTOTALVENDA,
      VRRECVOUCHER: item.VRRECVOUCHER,
      valorTotalVendaLiquida: valorTotalVendaLiquida,
      PRECO_COMPRA: item.PRECO_COMPRA,
    }
  });
  
  const colunasVendasVendedor = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true
    },
    {
      field: 'VENDEDOR_MATRICULA',
      header: 'Matrícula',
      body: row => <th>{row.VENDEDOR_MATRICULA}</th>,
      sortable: true
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Funcionário',
      body: row => <th>{row.VENDEDOR_NOME}</th>,
      sortable: true
    },
    {
      field: 'QTD_VENDAS',
      header: 'Quantidade Vendas',
      body: row => row.QTD_VENDAS,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeVendasPorPagina())}</th>
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeVendas())}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'QTD_PRODUTOS',
      header: 'Quantidade Produtos',
      body: row => row.QTD_PRODUTOS,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeProdutosPorPagina())}</th>
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeProdutos())}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Venda Bruta',
      body: row => formatMoeda(row.VRTOTALVENDA),
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBrutaVendasVendedorPorPagina())}</th>
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBrutaVendasVendedor())}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Valor Total Vouchers',
      body: row => formatMoeda(row.VRRECVOUCHER),
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorVoucherPorPagina())}</th>
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorVoucher())}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'valorTotalVendaLiquida',
      header: 'Total Venda Líquida',
      body: row => formatMoeda(row.valorTotalVendaLiquida),
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquidaVendasVendedorPorPagina())}</th>
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquidaVendasVendedor())}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'PRECO_COMPRA',
      header: 'Total Custo',
      body: row => formatMoeda(row.PRECO_COMPRA),
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorCustoPorPagina())}</th>
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorCusto())}</th>
          </div>
        )
      },
      sortable: true
    }
  ]
 

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas por Vendedor</h2>
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
            title="Vendas por Vendedor"
            value={dadosListaVendedorVendas}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            onPage={onPageChange}
            first={first}
            rows={rows}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaVendedorVendas.length]}
            totalRecords={dadosListaVendedorVendas.length}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasVendedor.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem'}}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  )

}