import { Fragment } from "react"
import { FooterModal } from "../../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import { useCadastrarClienteCNPJ } from "../hooks/useCadastroClienteCNPJ"
import { mascaraTelefone } from "../../../../../../utils/mascaraTelefone"
import { AlertError } from "../../../../../Inputs/alertError"
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from "./schemaValidationCNPJ"


export const FormularioCadastro = ({handleClose, usuarioLogado, optionsModulos}) => {
    const { register, handleSubmit, formState: {errors}, clearErrors } = useForm({
        resolver: yupResolver(schema)
    });
    const {
        idCliente,
        tipo,
        dataCadastro,
        cnpj,
        nomeClienteRazao,
        sobrenome,
        dataCriacao,
        telefoneCliente,
        numeroComercial,
        email,
        tipoIndicacaoIE,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        nuIBGE,
        cidade,
        estado,
        cpfFuncionario,
        empresa,
        IE,
        IM,
        cnae,
        telefoneComercial,

        setIdCliente,
        setTipo,
        setDataCadastro,
        setCnpj,
        setNomeClienteRazao,
        setSobrenome,
        setDataCriacao,
        setTelefoneCliente,
        setNumeroComercial,
        setEmail,
        setTipoIndicacaoIE,
        setCep,
        setEndereco,
        setNumero,
        setComplemento,
        setBairro,
        setNuIBGE,
        setCidade,
        setEstado,
        setTelefoneComercial,
        optionsIndicacaoIE,
        onSubmit
    } = useCadastrarClienteCNPJ({usuarioLogado, optionsModulos, handleClose});



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
                                placeholder={"CNPJ"}
                                value={tipo}
                                onChangeModal={(e) => setTipo(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 col-md-3 col-xl-2">
                            <InputFieldModal
                                label={"Data do Cadastro *"}
                                type="date"
                                id={"dataCadastro"}
                                readOnly={true}
                                value={dataCadastro}
                                onChangeModal={(e) => setDataCadastro(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-5 col-md-5 col-xl-5" >
                            <InputFieldModal
                                label={"CNPJ*"}
                                type="text"
                                id={"CPFCNPJ"}
                                value={cnpj}
                                onChangeModal={(e) => setCnpj(e.target.value)}
                                {...register("cnpj")}
                            />
                            {errors.cnpj && (
                                <AlertError
                                    error={errors.cnpj}
                                    onClose={clearErrors}
                                    fieldName="cnpj"
                                />
                            )}
                        </div>


                    </div>

                    <div className="row mt-3">
                        <div className="col-sm-2 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"Inscrição Estadual*"}
                                type="text"
                                id={"Inscrição Estadual"}
                                value={IE}
                                onChangeModal={(e) => setIE(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"Inscrição Municipal*"}
                                type="text"
                                id={"Inscrição Municipal"}
                                value={IM}
                                onChangeModal={(e) => setIM(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-5 col-md-3 col-xl-2">
                            <InputFieldModal
                                label={"CNAE*"}
                                type="text"
                                id={"cnae"}
                                value={cnae}
                                onChangeModal={(e) => setCNAE(e.target.value)}
                                {...register("cnae")}

                            />
                            {errors.cnae && (
                                <AlertError
                                    error={errors.cnae}
                                    onClose={clearErrors}
                                    fieldName="cnae"
                                />
                            )}
                        </div>

                        <div className="col-sm-3 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"Data do Criação *"}
                                type="date"
                                id={"dataCadastro"}
                                value={dataCriacao}
                                onChangeModal={(e) => setDataCriacao(e.target.value)}
                                {...register("dataCriacao")}
                            />
                            {errors.dataCriacao && (
                                <AlertError
                                    error={errors.dataCriacao}
                                    onClose={clearErrors}
                                    fieldName="dataCriacao"
                                />
                            )}
                        </div>

                    </div>

                    <div className="row mt-3">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"Razão Social*"}
                                type="text"
                                id={"nome"}
                                value={nomeClienteRazao}
                                onChangeModal={(e) => setNomeClienteRazao(e.target.value)}
                                {...register("nomeClienteRazao")}
                            />
                            {errors.nomeClienteRazao && (
                                <AlertError
                                    error={errors.nomeClienteRazao}
                                    onClose={clearErrors}
                                    fieldName="nomeClienteRazao"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"Nome Fantasia*"}
                                type="text"
                                id={"sobrenome"}
                                value={sobrenome}
                                onChangeModal={(e) => setSobrenome(e.target.value)}
                                {...register("sobrenome")}
                            />
                            {errors.sobrenome && (
                                <AlertError
                                    error={errors.sobrenome}
                                    onClose={clearErrors}
                                    fieldName="sobrenome"
                                />
                            )}
                        </div>

                    </div>

                    <div className="row mt-3">


                        <div className="col-sm-4 col-md-3 col-xl-2">
                            <InputFieldModal
                                label={"Telefone*"}
                                type="text"
                                id={"TelefoneCliente"}
                                value={mascaraTelefone(telefoneCliente)}
                                onChangeModal={(e) => setTelefoneCliente(e.target.value)}
                                {...register("telefoneCliente")}
                            />
                            {errors.telefoneCliente && (
                                <AlertError
                                    error={errors.telefoneCliente}
                                    onClose={clearErrors}
                                    fieldName="telefoneCliente"
                                />
                            )}
                        </div>
                        <div className="col-sm-4 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"Telefone Comercial"}
                                type="text"
                                id={"TelefoneComercial"}
                                value={mascaraTelefone(telefoneComercial)}
                                onChangeModal={(e) => setTelefoneComercial(e.target.value)}
                            />
                        </div>

                        <div className="col-sm-4 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"E-mail*"}
                                type="email"
                                id={"email"}
                                value={email}
                                onChangeModal={(e) => setEmail(e.target.value)}
                                {...register("email")}
                            />
                            {errors.email && (
                                <AlertError 
                                    error={errors.email}
                                    onClose={clearErrors}
                                    fieldName="email"
                                />
                            )}
                        </div>
                        <div className="col-sm-5 col-md-3 col-xl-4">
                            <label className="form-label" htmlFor={""}>Tipo Indicação IE</label>
                            <select 
                                className="select2 form-control"
                              {...register("tipoIndicacaoIE", { required: 'Tipo Indicação IE Obrigatório' })}  
                            >
                                <option value="" > Selecione </option>
                                {optionsIndicacaoIE.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.label}
                                
                                    </option>
                                ))}
                            </select>
                            {errors.tipoIndicacaoIE && ( 
                                <AlertError 
                                    error={errors.tipoIndicacaoIE} 
                                    onClose={clearErrors} 
                                    fieldName="tipoIndicacaoIE" 
                                />
                            )}  
                        </div>
                    </div>
                </div>

                <div className="form-group" >
                    <div className="row">
                        <div className="col-sm-2 cold-md-2 col-xl-2">
                            <InputFieldModal
                                label={"CEP*"}
                                type="text"
                                id={"NuCEP"}
                                value={cep}
                                onChangeModal={(e) => setCep(e.target.value)}
                                {...register("cep")}
                            />
                            {errors.cep && (
                                <AlertError
                                    error={errors.cep}
                                    onClose={clearErrors}
                                    fieldName="cep"
                                />
                            )}
                        </div>
                        <div className="col-sm-4 cold-md-4 col-xl-4">
                            <InputFieldModal
                                label={"Endereço*"}
                                type="text"
                                id={"Endereco"}
                                value={endereco}
                                onChangeModal={(e) => setEndereco(e.target.value)}
                                {...register("endereco")}
                            />
                            {errors.endereco && (
                                <AlertError 
                                    error={errors.endereco}
                                    onClose={clearErrors}
                                    fieldName="endereco"
                                />
                            )}
                        </div>
                        <div className="col-sm-1 cold-md-2 col-xl-2">
                            <InputFieldModal
                                label={"Número*"}
                                type="text"
                                id={"NuEndereco"}
                                value={numero}
                                onChangeModal={(e) => setNumero(e.target.value)}
                                {...register("numeroEndereco")}
                            />
                            {errors.numeroEndereco && (
                                <AlertError
                                    error={errors.numeroEndereco}
                                    onClose={clearErrors}
                                    fieldName="numeroEndereco"
                                />
                            )}
                        </div>
                        <div className="col-sm-5 cold-md-5 col-xl-4">
                            <InputFieldModal
                                label={"Complemento"}
                                type="text"
                                id={"Complemento"}
                                value={complemento}
                                onChangeModal={(e) => setComplemento(e.target.value)}
                                {...register("complemento")}
                            />
                            {errors.complemento && (
                                <AlertError
                                    error={errors.complemento}
                                    onClose={clearErrors}
                                    fieldName="complemento"
                                />
                            )}
                        </div>
                    </div>

                    <div className="row mt-3" >
                        <div className="col-sm-4 cold-md-4 col-xl-4">
                            <InputFieldModal
                                label={"Bairro*"}
                                type="text"
                                id={"Bairro"}
                                readOnly={true}
                                value={bairro}
                                onChangeModal={(e) => setBairro(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2 cold-md-2 col-xl-2">
                            <InputFieldModal
                                label={"Nº IBGE*"}
                                type="text"
                                id={"NuIBGE"}
                                readOnly={true}
                                value={nuIBGE}
                                onChangeModal={(e) => setNuIBGE(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-4 cold-md-4 col-xl-4">
                            <InputFieldModal
                                label={"Cidade*"}
                                type="text"
                                id={"Cidade"}
                                readOnly={true}
                                value={cidade}
                                onChangeModal={(e) => setCidade(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2 cold-md-2 col-xl-2">
                            <InputFieldModal
                                label={"Estado*"}
                                type="text"
                                id={"estado"}
                                readOnly={true}
                                value={estado}
                                onChangeModal={(e) => setEstado(e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            </form>

            <FooterModal
                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Cadastrar"}
                onClickButtonConfirmar={handleSubmit(onSubmit)}
                corConfirmar="success"

                ButtonTypeFechar={ButtonTypeModal}
                onClickButtonFechar={handleClose}
                textButtonFechar={"Fechar"}
                corFechar="secondary"
            />
        </Fragment>
    )
}