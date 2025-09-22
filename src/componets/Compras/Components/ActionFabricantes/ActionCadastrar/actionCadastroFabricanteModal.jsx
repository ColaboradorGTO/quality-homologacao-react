import { Fragment, useState } from "react"
import { Modal } from "react-bootstrap"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"

export const ActionCadastroFabricanteModal = ({ show, handleClose }) => {
  const [statusSelecionado, setStatusSelecionado] = useState(null)
  const [fabricante, setFabricante] = useState('')

  const handleChange = (e) => {
    setStatusSelecionado(e.value)
  }

  const options = [
    { value: 'True', label: 'Ativo' },
    { value: 'False', label: 'Inativo' },
  ]

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
        centered
      >

        <HeaderModal
          title={"Fabricantes"}
          subTitle={"Inclusão de Fabricantes e Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <div className="row">
            <div className="col-sm-6 col-xl-3">
              <InputFieldModal
                label={"Nome Fabricante *"}
                type={"text"}
                id={"nofabricante"}
                value={fabricante}
                onChangeModal={(e) => setFabricante(e.target.value)}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <label>Situação *</label>
              <Select
                id={"stativofab"}
                readOnly={false}
                options={options.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                value={statusSelecionado}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group mt-5">

            <h5 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h5>
          </div>
          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}
            corFechar={"secondary"}
          
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar
            textButtonCadastrar={"Salvar"}
            corCadastrar={"success"}
          />

        </Modal.Body>


      </Modal>
    </Fragment>
  )
}

