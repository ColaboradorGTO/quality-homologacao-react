import { Fragment, useState } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import Swal from 'sweetalert2'
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { post } from "../../../../../api/funcRequest";
import { FormularioCadastro } from "./formularioCadastro";


export const ActionCadastroCoresModal = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState("")
  const [descricao, setDescricao] = useState("")
  const [sigla, setSigla] = useState("")


  const onSubmit = async () => {
    let textoFuncao = 'COMPRAS/CADASTRO DE UNIDADES DE MEDIDAS';

    const postData = {
      IDCOR,
      IDGRUPOCOR,
      DSCOR,
      STATIVO: statusSelecionado,
    }

    const response = await post('/cadastrarCores', postData)
      .then(response => {

        // Limpar os campos do formulário


        console.log(response, 'despesa cadastrada com sucesso front end!')
      })


    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cadastrado com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(error)
      })
  }

  const handleChangeStatus = (e) => {
    setStatusSelecionado(e.value)
  }

  const options = [
    { value: 'True', label: 'ATIVO' },
    { value: 'False', label: 'INATIVO' }
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
          title={"Unidades de Medida"}
          subTitle={"Inclusão "}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioCadastro />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
