import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../utils/dataFormatada";
import { formatMoeda } from "../../utils/formatMoeda";


export const AdministrativoActionVendasCanceladasMinutosEmpresa = ({dadosVendasCanceladasMinutos}) => {
  
  const calcularTotalValorDinheiro = () => {
    let total = 0;
    for (let dados of dadosVendasCanceladasMinutos) {
      total += parseFloat(dados.VRRECDINHEIRO)
    }
    return total;
  }
  const dadosListaVendasCanceladasMinutos = dadosVendasCanceladasMinutos.map((item, index) => {
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

  const colunasVendasCanceladasMinutos = [
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
  
  ]

  return (

    <Fragment>

      <div id="card">

        <DataTable
          title="Vendas por Loja"
          value={dadosListaVendasCanceladasMinutos}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasVendasCanceladasMinutos.map(coluna => (
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
    </Fragment>
  )
}

