import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import Swal from 'sweetalert2'
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { get, post } from "../../../../../api/funcRequest";
import { FormularioEditar } from "./actionFormularioEditar";


export const ActionEditarCoresModal = ({ show, handleClose, dadosDetalheCores }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState("")
  const [descricao, setDescricao] = useState("")
  const [sigla, setSigla] = useState("")
  const [listaCores, setListaCores] = useState([])
  const [grupoCorSelecionado, setGrupoCorSelecionado] = useState("")

  useEffect(() => {
    getListaCores()
  }, [])

  const getListaCores = async () => {
    try {
      const response = await get(`/grupoCores`)
      if (response.data) {
        setListaCores(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const onSubmit = async () => {
    let textoFuncao = 'COMPRAS/CADASTRO DE UNIDADES DE MEDIDAS';

    const postData = {
      IDCOR,
      IDGRUPOCOR,
      DSCOR,
      STATIVO: statusSelecionado,
    }

    const response = await post('/atualizarCores', postData)
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

  const handleChangeGrupoCor = (e) => {
    setGrupoCorSelecionado(e.value)
  }

  const handleChangeDescricao = (e) => {
    setDescricao(e.target.value)
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
          title={"Cores"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioEditar handleClose={handleClose} dadosDetalheCores={dadosDetalheCores} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
