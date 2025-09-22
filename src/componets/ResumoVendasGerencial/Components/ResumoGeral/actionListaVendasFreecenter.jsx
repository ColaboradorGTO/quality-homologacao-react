import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaVendasFreecenter = ({ dadosTotalFreecenter}) => {

   const dados = Array.isArray(dadosTotalFreecenter) ? dadosTotalFreecenter.map((item, index) => {
      
  
      return {
  
        VALORTOTALVENDA: toFloat(item.VALORTOTALVENDA),
        NOFANTASIA: item.NOFANTASIA
        
      }
    }): [];
    
  
  
    const colunasVendasPagamento = [
      {
        field: 'NOFANTASIA',
        header: 'Loja',
        body: row => <th style={{ color: 'blue',width: '180px' }}>{row.NOFANTASIA}</th>,
       
        sortable: true,
      },
      {
        field: 'VALORTOTALVENDA',
        header: 'Vendas',
        body: row => <th style={{ color: 'blue', width: 100 }}>{formatMoeda(row.VALORTOTALVENDA)}</th>,
        sortable: true,
      },
    ]
 

  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">

          <h3>Top de Vendas Freecenter</h3>
        </div>
 
        <div className="card" >
          <DataTable
            title="Top de Vendas Freecenter"
            value={dados}
            size="small"
            rows={3}
            paginator={true} 
      
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasPagamento.map(coluna => (
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
      </div>


    </Fragment>
  )

}

