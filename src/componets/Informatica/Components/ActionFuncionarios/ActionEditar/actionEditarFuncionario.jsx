import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { get, post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { FormularioEditar } from "./formularioEditar";


export const ActionEditarFuncionario = ({ show, handleClose, dadosAtualizarFuncionarios }) => {
//   useEffect(() => {
//     if (dadosAtualizarFuncionarios) {
//       setEmpresaSelecionada(dadosAtualizarFuncionarios[0]?.IDEMPRESA);
//       setFuncaoSelecionado(dadosAtualizarFuncionarios[0]?.DSFUNCAO);
//       setTipoSelecionado(dadosAtualizarFuncionarios[0]?.DSTIPO);
//       setDataAdmissao(dadosAtualizarFuncionarios[0]?.DATA_ADMISSAO);
//       setCPF(dadosAtualizarFuncionarios[0]?.NUCPF);
//       setNomeFuncionario(dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO);
//       setLocalizacaoSelecionada(dadosAtualizarFuncionarios[0]?.STLOJA);
//       setValorSalario(dadosAtualizarFuncionarios[0]?.VALORSALARIO);
//       setValorDesconto(dadosAtualizarFuncionarios[0]?.PERC);
//       setSituacaoSelecionada(dadosAtualizarFuncionarios[0]?.STATIVO);
//       setSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);
//       setRepitaSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);
//       setCategoriaContratacao(dadosAtualizarFuncionarios[0]?.DSTIPO);

//     }

//   }, [dadosAtualizarFuncionarios]);

  const onSubmit = async (e) => {
    // e.preventDefault();
    const funcao = dadosAtualizarFuncionarios[0]?.DSFUNCAO;

    if(funcao !== 'TI') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Usuário não tem permissão para desconto maior ou igual há 20%',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (parseFloat(valorDesconto) > 50) {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Valor Desconto maior que permitido',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }


    const putData = {
      // IDSUBGRUPOEMPRESARIAL: dadosAtualizarFuncionarios[0]?.IDSUBGRUPOEMPRESARIAL,
      // NOFUNCIONARIO: dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO,
      // DSFUNCAO: funcaoSelecionado,
      // STATIVO: situacaoSelecionada,
      // VALORDISPONIVEL: dadosAtualizarFuncionarios[0]?.VALORDISPONIVEL || 0,
      // MOTIVODESC: dadosAtualizarFuncionarios[0]?.MOTIVODESC,
      
      NOFUNCIONARIO: nomeFuncionario,
      NUCPF: dadosAtualizarFuncionarios[0]?.NUCPF,
      NOLOGIN: dadosAtualizarFuncionarios[0]?.NOLOGIN,
      PWSENHA: dadosAtualizarFuncionarios[0]?.PWSENHA,
      IDEMPRESA: empresaSelecionada,
      DSFUNCAO: funcaoSelecionado,
      IDFUNCIONARIO: dadosAtualizarFuncionarios[0]?.IDFUNCIONARIO,
      DSTIPO: tipoSelecionado,
      PERC: valorDesconto,
      VALORSALARIO: valorSalario,
      VALORDISPONIVEL: dadosAtualizarFuncionarios[0]?.VALORDISPONIVEL || 0,
      STCONVENIO: isChecked,
      STDESCONTOFOLHA: isChecked,
      STLOJA: localizacaoSelecionada,
      IDFUNCALTERACAO: usuarioLogado?.id,
      ID: dadosAtualizarFuncionarios[0]?.ID,
      DATA_ADMISSAO: dataAdmissao,

    }

    try {
      const response = await put('/funcionarios-loja/:id', putData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/UPDATE DE FUNCIONARIOS';


      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)


      return responsePost.data;
    } catch (error) {
      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      console.error('Erro ao parsear o usuário do localStorage:', error);
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
          title={"Dados do Funcionário"}
          subTitle={" Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioEditar handleClose={handleClose} dadosAtualizarFuncionarios={dadosAtualizarFuncionarios} />

        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
