import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { post, put } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import Swal from "sweetalert2";
import axios from "axios";
import { use } from "react";
import { useEditarFatura } from "./hooks/useEditarFatura";

export const ActionEditarFaturaModal = ({ show, handleClose, dadosDetalheFatura, usuarioLogado, optionsModulos }) => {
  const {
    empresa,
    setEmpresa,
    codAutorizacao,
    setCodAutorizacao,
    valorFatura,
    setValorFatura,
    valorFaturaAntigo,
    setValorFaturaAntigo,
    numeroMovimento,
    setNumeroMovimento,
    onSubmit
  } = useEditarFatura({ dadosDetalheFatura, usuarioLogado, optionsModulos });


  const { register, handleSubmit, errors } = useForm();


  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        id="CadadiantamentoSalario"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Faturas dos Caixas"}
          subTitle={"Editar Fatura de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} >

            <div class="form-group">
              <div class="row">

                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Empresa"
                    value={usuarioLogado?.NOFANTASIA}
                    onChangeModal={(e) => setEmpresa(e.target.value)}           
                  />
                 
                </div>
                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Caixa - Cód. Autorização da Fatura"
                    value={`${dadosDetalheFatura[0]?.IDDETALHEFATURA} - ${dadosDetalheFatura[0]?.DSCAIXA} - ${dadosDetalheFatura[0]?.NUCODAUTORIZACAO}`}
                    onChangeModal={(e) => setNumeroMovimento(e.target.value)}
                
                  />
               
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row">


                <div class="col-sm-6 col-xl-4">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={false}
                    label="Código Autorização"
                    value={codAutorizacao}
                    onChangeModal={(e) => setCodAutorizacao(e.target.value)}
               
                  />
                  
                </div>
                <div class="col-sm-6 col-xl-4">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={false}
                    label="Valor Antigo da Fatura"
                    value={dadosDetalheFatura[0]?.VRRECEBIDO}
                    onChangeModal={(e) => setValorFaturaAntigo(e.target.value)}
                    

                  />
                  
                </div>
                <div class="col-sm-6 col-xl-4">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={false}
                    label="Valor Atual da Fatura"
                    value={valorFatura}
                    onChangeModal={(e) => setValorFatura(e.target.value)}
                    placeholder={"0"}
                    {...register("valorFatura", { required: true })}

                  />
                  
                </div>
              </div>
            </div>

            <FooterModal
            

              ButtonTypeConfirmar={ButtonTypeModal}
              textButtonConfirmar={"Confirmar Alteração"}
              onClickButtonConfirmar={onSubmit}
              corConfirmar="success"

              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar="secondary"
            />

          </form>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}