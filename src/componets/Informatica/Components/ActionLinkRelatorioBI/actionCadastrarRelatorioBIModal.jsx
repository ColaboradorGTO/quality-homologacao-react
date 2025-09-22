import { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from '../../../Modais/HeaderModal/HeaderModal';
import { InputFieldModal } from '../../../Buttons/InputFieldModal';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { useCadastrarRelatorioBi } from './hooks/useCadastrarRelatorioBi';

export const ActionCadastrarRelatorioBIModal = ({show, handleClose}) => {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const {
    linkRelatorioBI,
    setLinkRelatorioBI,
    empresaSelecionada,
    setEmpresaSelecionada,
    relatorioSelecionado,
    setRelatorioSelecionado,
    statusSelecionado,
    setStatusSelecionado,
    dadosEmpresas,
    dadosBI,
    onSubmit,
    optionsStatus
  } = useCadastrarRelatorioBi();
  
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
        title={"Link Relatório BI"}
        subTitle={"Cadastrar "}
        handleClose={handleClose}
      />


      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-">

                <label className="form-label" htmlFor={""}>Filíal</label>

                <Select
                  closeMenuOnSelect={false}
                  options={dadosEmpresas.map((item) => ({
                    value: item.IDEMPRESA,
                    label: item.NOFANTASIA
                  }))}
                  value={dadosEmpresas.find(option => option.value === empresaSelecionada)}
                  onChange={(selectedOption) => setEmpresaSelecionada(selectedOption.value)}
                />
              </div>

              <div className="col-sm-6 col-xl-6">
                <label className="form-label" htmlFor={""}>Relatório</label>

                <Select
                  closeMenuOnSelect={false}
                  options={dadosBI.map((item) => ({
                    value: item.IDRELATORIOBI,
                    label: item.DSRELATORIOBI
                  }))}
                  value={dadosBI.find(option => option.value === relatorioSelecionado)}
                  onChange={(selectedOption) => setRelatorioSelecionado(selectedOption.value)}
                />
              </div>


            </div>
            <div className="row mt-4">
              <div className="col-sm-6 col-xl-3">
                <label className="form-label" htmlFor={""}>Status</label>
            
                <Select
                  closeMenuOnSelect={false}
                  options={optionsStatus}
                  value={optionsStatus.find((obj) => obj.value === statusSelecionado)}
                  onChange={(selectedOption) => setStatusSelecionado(selectedOption.value)}
                />
              </div>
              <div className="col-sm-6 col-xl-12">

                <InputFieldModal
                  label={"Link "}
                  type="text"
                  id={"linkrelatoriobi"}
                  value={linkRelatorioBI}
                  onChangeModal={(e) => setLinkRelatorioBI(e.target.value)}
                  {...register("link", { required: "Campo obrigatório Informe o Link do Relatório", })}
                />
                {errors.link && <span className="text-danger">{errors.link.message}</span>}
              </div>

            </div>
          </div>
      
        </form>
      </Modal.Body>

      <FooterModal
      
        ButtonTypeCadastrar={ButtonTypeModal}
        onClickButtonCadastrar={onSubmit}
        textButtonCadastrar={"Cadastrar"}
        corCadastrar={"success"}

        ButtonTypeFechar={ButtonTypeModal}
        textButtonFechar={"Fechar"}
        onClickButtonFechar={handleClose}
        corFechar="secondary"

      />
    </Modal>
  </Fragment>
  )
}