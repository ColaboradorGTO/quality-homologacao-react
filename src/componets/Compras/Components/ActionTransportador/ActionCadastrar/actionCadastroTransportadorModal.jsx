import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Swal from 'sweetalert2'
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { post } from "../../../../../api/funcRequest"
import { getDataAtual } from "../../../../../utils/dataAtual"


export const ActionCadastroTrasnportadorModal = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [inscricaoEstadual, setInscricaoEstadual] = useState('')
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [nomeFantasia, setNomeFantasia] = useState('')
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [numeroIBGE, setNumeroIBGE] = useState('')
  const [nomeRepresentante, setNomeRepresentante] = useState('')
  const [email, setEmail] = useState('')
  const [telefone1, setTelefone1] = useState('')
  const [telefone2, setTelefone2] = useState('')
  const [telefone3, setTelefone3] = useState('')
  const [data, setData] = useState('')

  useEffect(() => {
    const dataAtual = getDataAtual()
    setData(dataAtual)
  }, [])

  const onSubmit = async () => {
    const postData = {
      IDTRANSPORTADORA: dadosDetalheTranspotador[0]?.IDTRANSPORTADORA,
      IDGRUPOEMPRESARIAL: dadosDetalheTranspotador[0]?.IDGRUPOEMPRESARIAL,
      IDSUBGRUPOEMPRESARIAL: dadosDetalheTranspotador[0]?.IDSUBGRUPOEMPRESARIAL,
      NORAZAOSOCIAL: razaoSocial,
      NOFANTASIA: nomeFantasia,
      NUCNPJ: cnpj,
      NUINSCESTADUAL: inscricaoEstadual,
      NUINSCMUNICIPAL: inscricaoMunicipal,
      NUIBGE: numeroIBGE,
      EENDERECO: endereco,
      ENUMERO: numero,
      ECOMPLEMENTO: complemento,
      EBAIRRO: bairro,
      ECIDADE: cidade,
      SGUF: uf,
      NUCEP: cep,
      EEMAIL: email,
      NUTELEFONE1: telefone1,
      NUTELEFONE2: telefone2,
      NUTELEFONE3: telefone3,
      NOREPRESENTANTE: nomeRepresentante,
      DTCADASTRO: data,
      DTULTATUALIZACAO: data,
      STATIVO: statusSelecionado,
    }

    const response = await post('/cadastrarDespesaLoja', postData)
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

  const optionsStatus = [
    { value: 'True', label: "Ativo" },
    { value: 'False', label: "Inativo" },
  ]

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="lg"
        centered
      >

        <HeaderModal
          title={"Transportador"}
          subTitle={"Inclusão"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <form>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-4 col-xl-4">

                  <InputFieldModal
                    label={"CNPJ *"}
                    type={"text"}
                    id={"cnpjFornecedor"}
                    placeholder={"00.000.000/0000-00"}
                    value={cnpj}
                    onChangeModal={(e) => setCnpj(e.target.value)}
                    {...register("cnpjFornecedor", { required: "Verique o campo CNPJ mínimo 14 Dígito(s) " })}
                    required={true}
                    minLength={14}
                  />
                  {errors.cnpjFornecedor && <span role="alert">{errors.cnpjFornecedor.message}</span>}
                </div>
                <div className="col-sm-4 col-xl-4">
                  <InputFieldModal
                    label={"Insc. Estadual"}
                    type={"text"}
                    id={"inscestadualforn"}
                    value={inscricaoEstadual}
                    onChangeModal={(e) => setInscricaoEstadual(e.target.value)}
                    {...register("inscestadualforn", { required: "Campo obrigatório Informe a Inscrição Estadual" })}
                    required={true}
                  />
                  {errors.inscestadualforn && <span role="alert">{errors.inscestadualforn.message}</span>}
                </div>
                <div className="col-sm-4 col-xl-4">
                  <InputFieldModal
                    label={"Insc. Municipal"}
                    type={"text"}
                    id={"inscmuniforn"}
                    value={inscricaoMunicipal}
                    onChangeModal={(e) => setInscricaoMunicipal(e.target.value)}
                    {...register("inscmuniforn", { required: "Campo obrigatório Informe a Inscrição Municipal" })}
                    required={true}
                  />
                  {errors.inscmuniforn && <span role="alert">{errors.inscmuniforn.message}</span>}
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-xl-4">

                  <InputFieldModal
                    label={"Razão Social *"}
                    type={"text"}
                    id={"razaoforn"}
                    value={razaoSocial}
                    onChangeModal={(e) => setRazaoSocial(e.target.value)}
                    {...register("razaoforn", { required: "Campo obrigatório Informe a Razão Social do Transportador" })}
                    required={true}
                  />
                  {errors.razaoforn && <span role="alert">{errors.razaoforn.message}</span>}
                </div>
                <div className="col-sm-6 col-xl-4">

                  <InputFieldModal
                    label={"Nome Fantasia *"}
                    type={"text"}
                    id={"fantasiaforn"}
                    value={nomeFantasia}
                    onChangeModal={(e) => setNomeFantasia(e.target.value)}
                    {...register("fantasiaforn", { required: "Campo obrigatório Informe o Nome Fantasia do Transportador" })}
                    required={true}
                  />
                  {errors.fantasiaforn && <span role="alert">{errors.fantasiaforn.message}</span>}
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-3 col-xl-2">

                  <InputFieldModal
                    label={"CEP *"}
                    type={"text"}
                    id={"cepforn"}
                    value={cep}
                    onChangeModal={(e) => setCep(e.target.value)}
                    {...register("cepforn", { required: "Campo obrigatório Informe o CEP" })}
                    required={true}
                  />
                  {errors.cepforn && <span role="alert">{errors.cepforn.message}</span>}
                </div>
                <div className="col-sm-3 col-xl-5">
                  <InputFieldModal
                    label={"Endereço *"}
                    type={"text"}
                    id={"enderecoforn"}
                    value={endereco}
                    onChangeModal={(e) => setEndereco(e.target.value)}
                    {...register("enderecoforn", { required: "Campo obrigatório Informe o Endereço do Transportador" })}
                    required={true}
                  />
                  {errors.enderecoforn && <span role="alert">{errors.enderecoforn.message}</span>}
                </div>
                <div className="col-sm-3 col-xl-2">

                  <InputFieldModal
                    label={"Nº *"}
                    type={"text"}
                    id={"numeroendforn"}
                    value={numero}
                    onChangeModal={(e) => setNumero(e.target.value)}
                    {...register("numeroendforn", { required: "Campo obrigatório Informe o Número do Endereço do Transportador" })}
                    required={true}
                  />
                  {errors.numeroendforn && <span role="alert">{errors.numeroendforn.message}</span>}
                </div>
                <div className="col-sm-3 col-xl-3">
                  <InputFieldModal
                    label={"Complemento"}
                    type={"text"}
                    id={"complementoendforn"}
                    value={complemento}
                    onChangeModal={(e) => setComplemento(e.target.value)}
                    {...register("complementoendforn")}
                  />

                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-3 col-xl-4">
                  <InputFieldModal
                    label={"Bairro *"}
                    type={"text"}
                    id={"bairroforn"}
                    value={bairro}
                    onChangeModal={(e) => setBairro(e.target.value)}
                    {...register("bairroforn", { required: "Campo obrigatório Informe o Bairro" })}
                    required={true}
                  />
                  {errors.bairroforn && <span role="alert">{errors.bairroforn.message}</span>}
                </div>
                <div className="col-sm-3 col-xl-4">
                  <InputFieldModal
                    label={"Cidade *"}
                    type={"text"}
                    id={"cidadeforn"}
                    value={cidade}
                    onChangeModal={(e) => setCidade(e.target.value)}
                    {...register("cidadeforn", { required: "Campo obrigatório Informe a Cidade do Transportador" })}
                    required={true}
                  />
                  {errors.cidadeforn && <span role="alert">{errors.cidadeforn.message}</span>}
                </div>
                <div className="col-sm-3 col-xl-2">
                  <InputFieldModal
                    label={"UF *"}
                    type={"text"}
                    id={"ufforn"}
                    value={uf}
                    onChangeModal={(e) => setUf(e.target.value)}
                    {...register("ufforn", { required: "Campo obrigatório Informe a UF" })}
                    required={true}
                  />
                  {errors.ufforn && <span role="alert">{errors.ufforn.message}</span>}
                </div>
                <div className="col-sm-3 col-xl-2">
                  <InputFieldModal
                    label={"Nº IBGE *"}
                    type={"text"}
                    id={"nibgeforn"}
                    value={numeroIBGE}
                    onChangeModal={(e) => setNumeroIBGE(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Nome Representante *"}
                    type={"text"}
                    id={"nomerepreforn"}
                    value={nomeRepresentante}
                    onChangeModal={(e) => setNomeRepresentante(e.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"E-mail"}
                    type={"text"}
                    id={"emailforn"}
                    placeholder={"E-mail"}
                    value={email}
                    onChangeModal={(e) => setEmail(e.target.value)}
                    {...register("Email", {required: true, pattern: /^\S+@\S+$/i})} 
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-3 col-xl-3">
                  <InputFieldModal
                    label={"Telefone 1 *"}
                    type={"text"}
                    id={"tel1forn"}
                    value={telefone1}
                    onChangeModal={(e) => setTelefone1(e.target.value)}
                    {...register("telefone1", {required: true, max: 14, min: 9, })}

                  />

                </div>
                <div className="col-sm-3 col-xl-3">
                  <InputFieldModal
                    label={"Telefone 2"}
                    type={"text"}
                    id={"tel2forn"}
                    value={telefone2}
                    onChangeModal={(e) => setTelefone2(e.target.value)}
                    {...register("telefone2", { max: 14, min: 9, })}
                  />
                </div>
                <div className="col-sm-3 col-xl-3">
                  <InputFieldModal
                    label={"Telefone 3"}
                    type={"text"}
                    id={"tel3forn"}
                    value={telefone3}
                    onChangeModal={(e) => setTelefone3(e.target.value)}
                    {...register("telefone3", { max: 14, min: 9, })}
                  />
                </div>

                <div className="col-sm-6 col-xl-3">

                  <label htmlFor="">Situação</label>
                  <Select
                    defaultValue={statusSelecionado}
                    options={optionsStatus.map((item) => {
                      return {
                        value: item.value,
                        label: item.label
                      }
                    })}
                    onChange={handleChangeStatus}
                  />
                </div>
              </div>
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
          </form>

        </Modal.Body>
      </Modal>
    </Fragment>
  )
}               