import { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FormularioCadastrarCampanha } from './formularioCadastrar';
import { HeaderModal } from '../../../../Modais/HeaderModal/HeaderModal';

export const ActionCadastrarCampanhaModal = ({ show, handleClose }) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Atualizar Cliente"}
          subTitle={"Atualizar Cliente"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrarCampanha  handleClose={handleClose} />
        </Modal.Body>

       
      </Modal>
    </Fragment>
  );
};