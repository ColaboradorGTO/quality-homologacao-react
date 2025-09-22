import { Fragment, useEffect } from "react"
import { FooterModal } from "../../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from 'react-select';
import { useCadastrarClienteCPF } from "../hooks/useCadastroClienteCPF"
import { mascaraCPF, validarCPF } from "../../../../../../utils/formatCPF"
import { mascaraTelefone } from "../../../../../../utils/mascaraTelefone"
import { validaTelefoneOrCelular } from "../../../../../../utils/validaTelefoneOrCelular"

async function validaCEP(cep, verificarNaApi = false) {
  const regex = /^[0-9]{5}-?[0-9]{3}$/;

  if (!regex.test(cep)) {
    return false;
  }

  if (verificarNaApi) {
    let respCep = await getDadosEnderecoViaCep_API_externa(cep);

    return !(respCep?.erro == 'true');
  }

  return true;
}

async function getDadosEnderecoViaCep_API_externa(cep) {
  const URL_VIA_CEP = 'https://viacep.com.br/ws/{CEP}/json/';
  cep = cep.replace(/\D/g, "");

  try {
    const response = await axios.get(URL_VIA_CEP.replace('{CEP}', cep));
    const data = response.data;
    let { erro } = data || {};

    // Se não houver erro, status é 200
    let status = erro ? 429 : 200;

    if (status !== 200) {
      return { status: 429, message: 'CEP INVÁLIDO OU NÃO ENCONTRADO, verifique e tente novamente!' };
    }

    return { status, data };
  } catch (respError) {
    let status = respError?.response?.status || 500;
    let message = respError?.response?.statusText || respError?.message || 'Erro ao consultar o CEP';
    return { status, message };
  }
}

const schema = yup.object({
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("cpf-valido", "CPF inválido", value => validarCPF(value)),
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(3, "Nome muito curto")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  sobrenome: yup
    .string()
    .required("Sobrenome é obrigatório")
    .min(2, "Sobrenome muito curto")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/, "Sobrenome deve conter apenas letras e espaços"),
  dataNascimento: yup
    .string()
    .required("Data de nascimento é obrigatória"),
  telefone: yup
    .string()
    .test("telefone-valido", "Telefone inválido", value => !value || validaTelefoneOrCelular(value)),
  email: yup
    .string()
    .email("E-mail inválido"),
  cep: yup
    .string()
    .required("CEP é obrigatório")
    .test("cep-valido", "CEP inválido", value => !value || validaCEP(value)),
  endereco: yup
    .string()
    .required("Endereço é obrigatório")
    .matches(/^[A-Za-z0-9\s\-\/.,ºªÇçÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûÀàÈèÌìÒòÙùÃãÕõÜü]*$/, "Endereço inválido")
    .test("not-only-numbers", "Endereço inválido", value => isNaN(Number(value))),
  numero: yup
    .string()
    .required("Número é obrigatório")
    .matches(/^\d+[A-Za-z\-\/]*$/, "Número inválido")
    .test("not-zero", "Número inválido", value => Number(value) !== 0),
  complemento: yup
    .string()
    .test('complemento-validation', 'Complemento Inválido, verifique o endereço e tente novamente!', function (value) {
      if (!value || value.length === 0) return true;
      const regex = /^[A-Za-z0-9\s\-\/.,ºªÇçÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûÀàÈèÌìÒòÙùÃãÕõÜü]*$/;
      return regex.test(value) && isNaN(Number(value));
    }),
  bairro: yup
    .string()
    .required("Bairro é obrigatório")
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Bairro inválido"),
  nuIBGE: yup
    .string()
    .required("Nº IBGE é obrigatório"),
  cidade: yup
    .string()
    .required("Cidade é obrigatória"),
  estado: yup
    .string()
    .required("Estado é obrigatório"),
});

export const FormularioCadastro = ({ handleClose, usuarioLogado, optionsModulos, optionsCPF, onCpf }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const {
    idCliente,
    setIdCliente,
    tipo,
    setTipo,
    dataCadastro,
    setDataCadastro,
    cpf,
    setCpf,
    nomeClienteRazao,
    setNomeClienteRazao,
    sobrenome,
    setSobrenome,
    dataNascimento,
    setDataNascimento,
    telefoneCliente,
    setTelefoneCliente,
    numeroComercial,
    setNumeroComercial,
    email,
    setEmail,
    tipoIndicacaoIE,
    setTipoIndicacaoIE,
    cep,
    setCep,
    endereco,
    setEndereco,
    numero,
    setNumero,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    nuIBGE,
    setNuIBGE,
    cidade,
    setCidade,
    estado,
    setEstado,
    cpfFuncionario,
    setCpfFuncionario,
    empresa,
    optionsIndicacaoIE,
    onSubmit,
    readOnlyCpf
  } = useCadastrarClienteCPF({ usuarioLogado, optionsModulos, handleClose, onCpf });

  useEffect(() => {
    if (optionsCPF?.length > 0) {
      setIdCliente(optionsCPF[0]?.IDCLIENTE);
      setDataCadastro(optionsCPF[0]?.DTCADASTRO);
      setCpf(optionsCPF[0]?.NUCPFCNPJ);
      setNomeClienteRazao(optionsCPF[0]?.DSNOMERAZAOSOCIAL);
      setSobrenome(optionsCPF[0]?.DSAPELIDONOMEFANTASIA);
      setDataNascimento(optionsCPF[0]?.DTNASCFUNDACAO);
      setTelefoneCliente(optionsCPF[0]?.NUTELCELULAR);
      setEmail(optionsCPF[0]?.EEMAIL);
      setCep(optionsCPF[0]?.NUCEP);
      setEndereco(optionsCPF[0]?.EENDERECO);
      setNumero(optionsCPF[0]?.NUENDERECO);
      setComplemento(optionsCPF[0]?.ECOMPLEMENTO);
      setBairro(optionsCPF[0]?.EBAIRRO);
      setNuIBGE(optionsCPF[0]?.NUIBGE);
      setCidade(optionsCPF[0]?.ECIDADE);
      setEstado(optionsCPF[0]?.SGUF);
    }
  }, [optionsCPF])

  const fecharModal = () => {
    handleClose();
    setIdCliente('');
    setTipo('');
    setCpf('');
    setNomeClienteRazao('');
    setSobrenome('');
    setDataNascimento('');
    setTelefoneCliente('');
    setNumeroComercial('');
    setEmail('');
    setTipoIndicacaoIE(0);
    setCep('');
    setEndereco('');
    setNumero('');
    setComplemento('');
    setBairro('');
    setNuIBGE('');
    setCidade('');
    setEstado('');
  }

  // console.log(tipoIndicacaoIE, 'tipoIndicacaoIE.value')
  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group" >
          <div className="row mt-2" style={{ width: '100%' }}>
            <div className="col-sm-2 col-md-2 col-xl-1">
              <InputFieldModal
                label={"ID"}
                type="text"
                id={"idClienteEmpresa"}
                readOnly={true}
                value={idCliente}
                onChangeModal={(e) => setIdCliente(e.target.value)}
              />
            </div>
            <div className="col-sm-2 col-md-2 col-xl-1">
              <InputFieldModal
                label={"Tipo *"}
                type="text"
                id={"tipoClienteEmpresa"}
                placeholder={"CPF"}
                value={tipo}
                onChangeModal={(e) => setTipo(e.target.value)}
                {...register("tipo")}
                readOnly={true}
              />
              {errors.tipo && <span className="text-danger">{errors.tipo.message}</span>}
            </div>
            <div className="col-sm-3 col-md-3 col-xl-2">
              <InputFieldModal
                label={"Data do Cadastro *"}
                placeholder={"Data do Cadastro"}
                type="text"
                id={"dataCadastro"}
                value={dataCadastro}
                onChangeModal={(e) => setDataCadastro(e.target.value)}
                {...register("dataCadastro")}
                readOnly={true}
              />
              {errors.dataCadastro && <span className="text-danger">{errors.dataCadastro.message}</span>}
            </div>
            <div className="col-sm-5 col-md-5 col-xl-2" >
              <InputFieldModal
                label={"CPF*"}
                placeholder={"DIGITE O CPF"}
                type="text"
                id={"CPFCNPJ"}
                value={mascaraCPF(cpf)}
                onChangeModal={(e) => setCpf(e.target.value)}
                readOnly={readOnlyCpf}
                maxLength={14}
                {...register("cpf")}
              />
              {errors.cpf && <span className="text-danger">{errors.cpf.message}</span>}
            </div>

            <div className="col-sm-6 col-xl-3">
              <InputFieldModal
                label={"Nome*"}
                placeholder={"DIGITE O NOME"}
                type="text"
                id={"nome"}
                value={nomeClienteRazao.toUpperCase()}
                onChangeModal={(e) => setNomeClienteRazao(e.target.value)}
                {...register("nome")}
              />
              {errors.nome && <span className="text-danger">{errors.nome.message}</span>}
            </div>
            <div className="col-sm-6 col-xl-3">
              <InputFieldModal
                label={"Sobrenome*"}
                placeholder={"DIGITE O SOBRENOME"}
                type="text"
                id={"sobrenome"}
                value={sobrenome.toUpperCase()}
                onChangeModal={(e) => setSobrenome(e.target.value)}
                {...register("sobrenome")}
              />
              {errors.sobrenome && <span className="text-danger">{errors.sobrenome.message}</span>}
            </div>
          </div>

          <div className="row mt-3">

            <div className="col-sm-3 col-md-3 col-xl-2">
              <InputFieldModal
                label={"Data de Nascimento*"}
                type="date"
                id={"dataNascimento"}
                value={dataNascimento}
                onChangeModal={(e) => setDataNascimento(e.target.value)}
                {...register("dataNascimento")}

              />
              {errors.dataNascimento && <span className="text-danger">{errors.dataNascimento.message}</span>}
            </div>


            <div className="col-sm-4 col-md-3 col-xl-3">
              <InputFieldModal
                label={"Telefone"}
                placeholder={"DIGITE O TELEFONE"}
                type="text"
                id={"TelefoneCliente"}
                value={mascaraTelefone(telefoneCliente.toUpperCase())}
                onChangeModal={(e) => setTelefoneCliente(e.target.value)}
                {...register("TelefoneCliente", {
                  pattern: {
                    value: /^(\(?\d{2}\)?\s?)?(\d{4,5}\-?\d{4})$/,
                    message: "Número inválido"
                  }
                })}
              />
            </div>

            <div className="col-sm-5 col-md-4 col-xl-4">
              <InputFieldModal
                label={"E-mail"}
                placeholder={"DIGITE O E-MAIL"}
                type="email"
                id={"email"}
                value={email.toUpperCase()}
                onChangeModal={(e) => setEmail(e.target.value)}
                style={{ textTransform: "uppercase" }}
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Endereço de e-mail inválido"
                  }
                })}
              />
              {errors.email && <span className="text-danger">{errors.email.message}</span>}
            </div>


            <div className="col-sm-5 col-md-5 col-xl-3">
              <label className="form-label" htmlFor={""}>Tipo Indicação IE</label>
              {/* <Select
                options={[
                  { value: 9, label: 'Não Contribuinte Com ou Sem IE' },
                    optionsIndicacaoIE.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })
                ]}
                defaultValue={[optionsIndicacaoIE[0].value, 'optionsIndicacaoIE', { value: 9, label: 'Não Contribuinte Com ou Sem IE' }]}
                value={tipoIndicacaoIE.value}
                onChange={(e) => setTipoIndicacaoIE(e.value)}
                // isDisabled={true}
              /> */}
              <select
                className="select2 form-control select2-hidden-accessible"
                value={tipoIndicacaoIE}
                onChange={(e) => setTipoIndicacaoIE(Number(e.target.value))}
                id={"tipoIndicacaoIE"}
                disabled={true}
              >
                <option value={9}>{'Não Contribuinte Com ou Sem IE'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group" >
          <div className="row">
            <div className="col-sm-2 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"CEP*"}
                placeholder={"DIGITE O CEP"}
                type="text"
                id={"NuCEP"}
                value={cep}
                onChangeModal={(e) => setCep(e.target.value)}
                {...register("cep")}
              />
              {errors.cep && <span className="text-danger">{errors.cep.message}</span>}
            </div>
            <div className="col-sm-4 cold-md-4 col-xl-4">
              <InputFieldModal
                label={"Endereço*"}
                placeholder={"DIGITE O ENDEREÇO"}
                type="text"
                id={"Endereco"}
                value={endereco.toUpperCase()}
                onChangeModal={(e) => setEndereco(e.target.value)}
                {...register("endereco")}
              />
              {errors.endereco && <span className="text-danger">{errors.endereco.message}</span>}
            </div>
            <div className="col-sm-2 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"Número*"}
                placeholder={"NÚMERO"}
                type="text"
                id={"NuEndereco"}
                value={numero.toUpperCase()}
                onChangeModal={(e) => setNumero(e.target.value)}
                {...register("numero")}
              />
              {errors.numero && <span className="text-danger">{errors.numero.message}</span>}
            </div>
            <div className="col-sm-4 cold-md-4 col-xl-4">
              <InputFieldModal
                label={"Complemento"}
                placeholder={"DIGITE O COMPLEMENTO"}
                type="text"
                id={"Complemento"}
                value={complemento?.toUpperCase()}
                onChangeModal={(e) => setComplemento(e.target.value)}
                {...register("complemento")}
              />
              {errors.complemento && (
                <span className="text-danger">{errors.complemento.message}</span>
              )}
            </div>
          </div>

          <div className="row mt-3" >
            <div className="col-sm-4 cold-md-4 col-xl-4">
              <InputFieldModal
                label={"Bairro*"}
                placeholder={"DIGITE O BAIRRO"}
                type="text"
                id={"Bairro"}
                value={bairro.toUpperCase()}
                {...register("bairro")}
                onChangeModal={(e) => setBairro(e.target.value)}
                readOnly={true}
              />
              {errors.bairro && <span className="text-danger">{errors.bairro.message}</span>}
            </div>
            <div className="col-sm-2 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"Nº IBGE*"}
                placeholder={"DIGITE O Nº IBGE"}
                type="text"
                id={"NuIBGE"}
                value={nuIBGE}
                onChangeModal={(e) => setNuIBGE(e.target.value)}
                {...register("nuIBGE")}
                readOnly={true}
              />
              {errors.nuIBGE && <span className="text-danger">{errors.nuIBGE.message}</span>}
            </div>
            <div className="col-sm-4 cold-md-4 col-xl-4">
              <InputFieldModal
                label={"Cidade*"}
                placeholder={"DIGITE A CIDADE"}
                type="text"
                id={"Cidade"}
                value={cidade.toUpperCase()}
                onChangeModal={(e) => setCidade(e.target.value)}
                {...register("cidade")}
                readOnly={true}
              />
              {errors.cidade && <span className="text-danger">{errors.cidade.message}</span>}
            </div>
            <div className="col-sm-2 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"Estado*"}
                placeholder={"ESTADO(UF)"}
                type="text"
                id={"estado"}
                value={estado.toUpperCase()}
                onChangeModal={(e) => setEstado(e.target.value)}
                {...register("estado")}
                readOnly={true}
              />
              {errors.estado && <span className="text-danger">{errors.estado.message}</span>}
            </div>
          </div>
        </div>
      </form>

      <FooterModal
        ButtonTypeConfirmar={ButtonTypeModal}
        textButtonConfirmar={"Confirmar"}
        onClickButtonConfirmar={onSubmit}
        corConfirmar="success"

        ButtonTypeFechar={ButtonTypeModal}
        onClickButtonFechar={fecharModal}
        textButtonFechar={"Fechar"}
        corFechar="secondary"
      />
    </Fragment>
  )
}