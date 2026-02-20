import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";


export const ActionListaProdutoVendidoColaborador  = ({dadosColaboradorProdutosVendidos}) => {
const [rowSelection, setRowSelection] = useState(null);
 
  const calcularTotalQuantidadeProdutoColaborador = () => {
    let total = 0;
    for(let dados of dadosListaFunconarios) {
      total += parseFloat(dados.QTD);
    }
    return total;
  }

  // const calcularTotalQuantidadeProdutoColaboradoPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   for(let i = firstIndex; i < lastIndex && i < dadosListaFunconarios.length; i++) {
  //     if(dadosListaFunconarios[i]) {
  //       total += parseFloat(dadosListaFunconarios[i].QTD);
  //     }
  //   }
  //   return total;
  // }

  const calcularTotalValorUnitarioColaborador = () => {
    let total = 0;
    for(let dados of dadosListaFunconarios) {
      total += parseFloat(dados.VALOR_UNITARIO);
    }
    return total;
  }

  // const calcularTotalValorUnitarioColaboradorPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   for(let i = firstIndex; i < lastIndex && i < dadosListaFunconarios.length; i++) {
  //     if(dadosListaFunconarios[i]) {
  //       total += parseFloat(dadosListaFunconarios[i].VALOR_UNITARIO);
  //     }
  //   }
  //   return total;
  // }

  const calcularTotalValorTotalColaborador = () => {
    let total = 0;
    for(let dados of dadosListaFunconarios) {
      total += parseFloat(dados.VALOR_TOTAL);
    }
    return total;
  }

  // const calcularTotalValorTotalColaboradorPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   for(let i = firstIndex; i < lastIndex && i < dadosListaFunconarios.length; i++) {
  //     if(dadosListaFunconarios[i]) {
  //       total += parseFloat(dadosListaFunconarios[i].VALOR_TOTAL);
  //     }
  //   }
  //   return total;
  // }

  const dadosListaFunconarios = dadosColaboradorProdutosVendidos.map((item, index) => {
    let contador = index + 1;
    return {
      NOFANTASIA: item.NOFANTASIA,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NUCPF: item.NUCPF,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      QTD: item.QTD,
      VALOR_UNITARIO: item.VALOR_UNITARIO,
      VALOR_TOTAL: item.VALOR_TOTAL,

      contador,
    }
  })

  const colunasListaColaborador = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => row.NOFANTASIA,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => row.NOFUNCIONARIO,
      sortable: true,
    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: row => row.NUCPF,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => row.NUCODBARRAS,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => row.DSNOME,
      sortable: true,
    },

    {
      field: 'QTD',
      header: 'QTD',
      body: row => parseFloat(row.QTD),
      footer: (row) => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeProdutoColaboradoPorPagina())}</p> */}
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeProdutoColaborador())}</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VALOR_UNITARIO',
      header: 'Valor Unitário',
      body: row => formatMoeda(row.VALOR_UNITARIO),
      footer: (row) => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorUnitarioColaboradorPorPagina())}</p> */}
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorUnitarioColaborador())}</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VALOR_TOTAL',
      header: 'Valor Total',
      body: row => formatMoeda(row.VALOR_TOTAL),
      footer: (row) => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorTotalColaboradorPorPagina())}</p> */}
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalValorTotalColaborador())}</p>
          </div>
        )
      },
      sortable: true,
    },
  ]

  return (

    <Fragment>
      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosListaFunconarios}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator
          rows={10}
          selectionMode="single"
          selection={rowSelection}
          onSelectionChange={(e) => setRowSelection(e.value)}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
          filterDisplay="menu"
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasListaColaborador.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}                          
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
              footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
      </div>
      
    </Fragment>
  )
}