import React, { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import Swal from "sweetalert2";
import { post } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ActionCadastrarRelatorioBIModal = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/');
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  };

  const optionsStatus = [
    { value: "True", label: "Ativo" },
    { value: "False", label: "Inativo" },
  ]

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
      STATIVO: statusSelecionado
    }
    try {

      const response = await post('/createRelatorioInformaticaBI', postData)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Relatório cadastrado com sucesso!',
        customClass: {
          container: 'custom-swal', 
        },
        showConfirmButton: false,
        timer: 1500
      })
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/CRIANDO RELATORIO BI';
  
      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };
  
      const responsePost = await post('/log-web', createData);
  
      handleClose()
      return responsePost.data;
    
      
    } catch (error) {
      let textoFuncao = 'INFORMATICA/ERRO AO CRIAR RELATORIO BI';
  
      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: 'Erro ao criar Relatório',
        IP: ipUsuario,
      };
  
      const responsePost = await post('/log-web', createData);
  
      handleClose()
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao cadastrar Relatório!',
        customClass: {
          container: 'custom-swal', 
        },
        showConfirmButton: false,
        timer: 1500
      });
      return responsePost.data;
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
          subTitle={"Cadastrar Relatório BI"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="row">

              <div className="col-sm-6 ">
                <InputFieldModal
                  label={"Descrição "}
                  type="text"
                  id={"descricao"}
                  value={descricao}
                  onChangeModal={(e) => setDescricao(e.target.value)}
                  {...register("descricao", { required: "Campo obrigatório Informe uma Descrição", })}
                />
                
                {errors.descricao && <span className="text-danger">{errors.descricao.message}</span>}
              </div>

              <div className="col-sm-6 ">
                <label className="form-label" htmlFor={""}>Status</label>

                <Select
                  closeMenuOnSelect={false}
                  options={optionsStatus.map((item) => ({
                    value: item.value,
                    label: item.label
                  }))}
                  value={optionsStatus.find((obj) => obj.value === statusSelecionado)}
                  onChange={(selectedOption) => setStatusSelecionado(selectedOption.value)}
                />
              </div>

            </div>
          </form>

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
