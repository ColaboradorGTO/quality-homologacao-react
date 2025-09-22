import { Fragment, useRef } from "react";
  import Modal from 'react-bootstrap/Modal';
  import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
  import './styles.css';
  import { formatMoeda } from "../../../../utils/formatMoeda";
  import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
  import { FooterModal } from "../../../Modais/FooterModal/footerModal";
  import { useReactToPrint } from "react-to-print";

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  export const ActionImprimirEtiquetaModal = ({ show, handleClose, dadosEtiquetas, copias, quantidadeEtiquetas }) => {
    const dataTableRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => dataTableRef.current,
      documentTitle: "Lista de Etiquetas",
    });

    const etiquetas = dadosEtiquetas.map((item) => ({
      idEtiqueta: item.idEtiqueta,
      quantidade: item.quantidade,
      valor: item.valor
    }));

    const etiquetasPorPagina = chunkArray(etiquetas, 4);
    const totalPaginas = etiquetasPorPagina.length * copias;

    
    return (
      <Fragment>
        <Modal
          show={show}
          onHide={handleClose}
          size="xl"
          className="modal fade"
          role="dialog"
        >
          <HeaderModal
            title={"Etiquetas"}
            subTitle={"Etiquetas"}
            handleClose={handleClose}
          />
          <Modal.Body>
            <header>
              <p>Qtd: Páginas <b>{totalPaginas + ' ' + 'Páginas'}</b></p>
              <p>Qtd Etiquetas: <b>{quantidadeEtiquetas + ' ' + 'unidades'} </b></p>
            </header>
            <div style={{ width: '100%' }} ref={dataTableRef}>
              {etiquetasPorPagina.map((pagina, pageIndex) => (
                <div
                  className="etiqueta-remarcacao-page"
                  key={pageIndex}
                >
                  {pagina.map((etiqueta, etiquetaIndex) => (
                    <div
                      className="etiqueta-remarcacao-card border-dark rounded "
                      key={etiquetaIndex}
                      style={{ borderRadius: '4px', maxWidth: '100%' }}
                    >
                      <div
                        className="preco-remarcacao "
                        style={{
                          fontSize: 'em',
                          justifyContent: 'center',
                          backgroundColor: '',
                          maxWidth: '100%'
                        }}
                      >
                        <h2 style={{ margin: '1px' }}>
                          {formatMoeda(etiqueta?.valor)}
                        </h2>
                      </div>
                    </div>
                  ))}
                  <p className="etiqueta-remarcacao-page-number">{pageIndex + 1}</p>
                </div>
              ))}
            </div>
          </Modal.Body>
          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            textButtonCadastrar={"Imprimir"}
            onClickButtonCadastrar={handlePrint}
            corCadastrar={"primary"}
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"
          />
        </Modal>
      </Fragment>
    );
  };