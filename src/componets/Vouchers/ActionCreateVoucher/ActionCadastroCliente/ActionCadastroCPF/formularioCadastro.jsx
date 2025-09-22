import { Fragment, useEffect } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from 'react-select';
import { useCadastrarClienteCPF } from "../hooks/useCadastroClienteCPF"
import { mascaraCPF } from "../../../../../utils/formatCPF"
import { mascaraTelefone } from "../../../../../utils/mascaraTelefone"

const schema = yup.object({
  complemento: yup.string()
    .test('complemento-validation', 'Complemento Inválido, verifique o endereço e tente novamente!', function (value) {
      // Se não tem valor ou está vazio, passa na validação (campo não obrigatório)
      if (!value || value.length === 0) {
        return true;
      }

      // Aplica a mesma lógica do jQuery
      const regex = /^[A-Za-z0-9\s\-\/.,ºªÇçÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûÀàÈèÌìÒòÙùÃãÕõÜü]*$/;
      const isValidPattern = regex.test(value);
      const isNotOnlyNumbers = isNaN(Number(value));

      // Retorna true se atende o padrão E não é apenas números
      return isValidPattern && isNotOnlyNumbers;
    })
})

export const FormularioCadastro = ({ handleClose, usuarioLogado, optionsModulos, optionsCPF, onCpf }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
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
    if (optionsCPF.length > 0) {
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
            <div className="col-sm-2 col-md-2 col-xl-2">
              <InputFieldModal
                label={"ID"}
                type="text"
                id={"idClienteEmpresa"}
                readOnly={true}
                value={idCliente}
                onChangeModal={(e) => setIdCliente(e.target.value)}
              />
            </div>
            <div className="col-sm-2 col-md-2 col-xl-2">
              <InputFieldModal
                label={"Tipo *"}
                type="text"
                id={"tipoClienteEmpresa"}
                readOnly={true}
                placeholder={"CPF"}
                value={tipo}
                onChangeModal={(e) => setTipo(e.target.value)}
              />
            </div>
            <div className="col-sm-3 col-md-3 col-xl-3">
              <InputFieldModal
                label={"Data do Cadastro *"}
                placeholder={"Data do Cadastro"}
                type="text"
                id={"dataCadastro"}
                value={dataCadastro}
                onChangeModal={(e) => setDataCadastro(e.target.value)}
                readOnly={true}
              />
            </div>
            <div className="col-sm-5 col-md-5 col-xl-5" >
              <InputFieldModal
                label={"CPF*"}
                placeholder={"DIGITE O CPF"}
                type="text"
                id={"CPFCNPJ"}
                value={mascaraCPF(cpf)}
                onChangeModal={(e) => setCpf(e.target.value)}
                readOnly={readOnlyCpf}
                maxLength={14}
                {...register("cpf", {
                  required: "CPF é obrigatório",
                  pattern: {
                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                    message: "CPF inválido"
                  }
                })}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Nome*"}
                placeholder={"DIGITE O NOME"}
                type="text"
                id={"nome"}
                value={nomeClienteRazao.toUpperCase()}
                onChangeModal={(e) => setNomeClienteRazao(e.target.value)}
              />
            </div>
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Sobrenome*"}
                placeholder={"DIGITE O SOBRENOME"}
                type="text"
                id={"sobrenome"}
                value={sobrenome.toUpperCase()}
                onChangeModal={(e) => setSobrenome(e.target.value)}
              />
            </div>

          </div>

          <div className="row mt-3">

            <div className="col-sm-6 col-md-4 col-xl-4">
              <InputFieldModal
                label={"Data de Nascimento*"}
                type="date"
                id={"dataNascimento"}
                value={dataNascimento}
                onChangeModal={(e) => setDataNascimento(e.target.value)}
              />
            </div>


            <div className="col-sm-6 col-md-4 col-xl-4">
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

            <div className="col-sm-6 col-md-4 col-xl-4">
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
            </div>

            <div className="col-sm-6 col-md-6 col-xl-6">
              <label className="form-label" htmlFor={""}>Tipo Indicação IE</label>
              <Select
                options={[
                  { value: 9, label: 'Não Contribuinte Com ou Sem IE' },
                  ...optionsIndicacaoIE.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })
                ]}
                defaultValue={[optionsIndicacaoIE[0].value]}
                value={tipoIndicacaoIE.value}
                onChange={(e) => setTipoIndicacaoIE(e.value)}
                isDisabled={true}
              />
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
              />
            </div>
            <div className="col-sm-4 cold-md-4 col-xl-4">
              <InputFieldModal
                label={"Endereço*"}
                placeholder={"DIGITE O ENDEREÇO"}
                type="text"
                id={"Endereco"}
                value={endereco.toUpperCase()}
                onChangeModal={(e) => setEndereco(e.target.value)}
              />
            </div>
            <div className="col-sm-1 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"Número*"}
                placeholder={"DIGITE O NÚMERO"}
                type="text"
                id={"NuEndereco"}
                value={numero.toUpperCase()}
                onChangeModal={(e) => setNumero(e.target.value)}
              />
            </div>
            <div className="col-sm-5 cold-md-5 col-xl-4">
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
                {...register("bairro", {
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: "Bairro inválido"
                  }
                })}
                onChangeModal={(e) => setBairro(e.target.value)}
                readOnly={true}
              />
            </div>
            <div className="col-sm-2 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"Nº IBGE*"}
                placeholder={"DIGITE O Nº IBGE"}
                type="text"
                id={"NuIBGE"}
                value={nuIBGE}
                onChangeModal={(e) => setNuIBGE(e.target.value)}
                readOnly={true}
              />
            </div>
            <div className="col-sm-4 cold-md-4 col-xl-4">
              <InputFieldModal
                label={"Cidade*"}
                placeholder={"DIGITE A CIDADE"}
                type="text"
                id={"Cidade"}
                value={cidade.toUpperCase()}
                onChangeModal={(e) => setCidade(e.target.value)}
                readOnly={true}
              />
            </div>
            <div className="col-sm-2 cold-md-2 col-xl-2">
              <InputFieldModal
                label={"Estado*"}
                placeholder={"ESTADO(UF)"}
                type="text"
                id={"estado"}
                value={estado.toUpperCase()}
                onChangeModal={(e) => setEstado(e.target.value)}
                readOnly={true}
              />
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