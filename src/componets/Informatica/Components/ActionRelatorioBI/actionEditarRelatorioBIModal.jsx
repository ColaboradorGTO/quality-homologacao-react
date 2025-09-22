import React, { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import Swal from "sweetalert2";
import { put } from "../../../../api/funcRequest";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";

export const ActionEditarRelatorioBIModal = ({ show, handleClose, dadosRelatorios }) => {
  const { register, handleSubmit, errors } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const optionsStatus = [
    { value: "True", label: "Ativo" },
    { value: "False", label: "Inativo" },
  ]

  useEffect(() => {
    if(dadosRelatorios && dadosRelatorios[0]?.DSRELATORIOBI) {
      setDescricao(dadosRelatorios[0]?.DSRELATORIOBI)
    }
  }, [dadosRelatorios])

  useEffect(() => {
    if(dadosRelatorios && dadosRelatorios[0]?.STATIVO) {
      setStatusSelecionado(dadosRelatorios[0]?.STATIVO)
    }

  }, [dadosRelatorios])
  
  const onSubmit = async (data) => {
    if(!descricao || !statusSelecionado){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Preencha todos os campos!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    const postData = {
      DSRELATORIOBI: descricao,
      STATIVO: statusSelecionado,
      IDRELATORIOBI: dadosRelatorios[0]?.IDRELATORIOBI,

    }
    try {
  
      const response = await put('/relatorioInformaticaBI/:id', postData)
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Relatório atualizado com sucesso!',
        customClass: {
          container: 'custom-swal', 
        },
        showConfirmButton: false,
        timer: 1500
      })
      handleClose()
      return response;
    } catch (error) {

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao atualizar Relatório!',
        customClass: {
          container: 'custom-swal', 
        },
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  return (

    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Relatório BI"}
          subTitle={"Alterar Relatório BI"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <div className="row">

            <div className="col-sm-6 ">
              <InputFieldModal
                label={"Descrição "}
                type="text"
                id={"descrelatoriobi"}
                value={descricao}
                onChangeModal={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="col-sm-6 ">
              <label className="form-label" htmlFor={""}>Status</label>

              <Select
                closeMenuOnSelect={false}
                options={optionsStatus.map((item) => ({
                  value: item.value,
                  label: item.label
                }))}
                value={optionsStatus.find(option => option.value === statusSelecionado)}
                onChange={(selectedOption) => {
                  setStatusSelecionado(selectedOption.value)
                }}
              />
            </div>

          </div>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"

            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Confirmar"}
            onClickButtonConfirmar={onSubmit}
            corConfirmar="success"
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
