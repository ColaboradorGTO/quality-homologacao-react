import { Fragment } from "react"
import { useCadastrarFornecedor } from "../hooks/useCadastrarFornecedor"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useForm } from "react-hook-form";

export const FormularioCadastrar = ({handleClose }) => {
    const { register, handleSubmit, errors } = useForm();

    const {
        cnpj,
        setCnpj,
        inscricaoEstadual,
        setInscricaoEstadual,
        inscricaoMunicipal,
        setInscricaoMunicipal,
        razaoSocial,
        setRazaoSocial,
        nomeFantasia,
        setNomeFantasia,
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
        cidade,
        setCidade,
        uf,
        setUf,
        numeroIBGE,
        setNumeroIBGE,
        nomeRepresentante,
        setNomeRepresentante,
        email,
        setEmail,
        telefone1,
        setTelefone1,
        telefone2,
        setTelefone2,
        telefone3,
        setTelefone3,
        situacaoSelecionada,
        setSituacaoSelecionada,
        fiscal,
        setFiscal,
        enviar,
        setEnviar,
        condicaoPagamento,
        setCondicaoPagamento,
        tipoPedido,
        setTipoPedido,
        vendedor,
        setVendedor,
        emailVendedor,
        setEmailVendedor,
        transportadora,
        setTransportadora,
        tipoFrete,
        setTipoFrete,
        optionsSituacao,
        optionsFrete,
        optionsPedido,
        optionsEnviar,
        optionsFiscal,
        dadosTransportadora,
        dadosCondicoesPagamento,
        handleCadastrar,
    } = useCadastrarFornecedor(handleClose)

    return (
        <Fragment>
             <form onSubmit={handleSubmit(handleCadastrar)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xl-4">

                            <InputFieldModal
                                label={"CNPJ *"}
                                type={"text"}
                                id={"cnpjforn"}
                                value={cnpj}
                                onChangeModal={(e) => setCnpj(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <InputFieldModal
                                label={"Insc. Estadual"}
                                type={"text"}
                                id={"inscestadualforn"}
                                value={inscricaoEstadual}
                                onChangeModal={(e) => setInscricaoEstadual(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <InputFieldModal
                                label={"Insc. Municipal"}
                                type={"text"}
                                id={"inscmuniforn"}
                                value={inscricaoMunicipal}
                                onChangeModal={(e) => setInscricaoMunicipal(e.target.value)}
                            />
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
                            />
                        </div>
                        <div className="col-sm-6 col-xl-4">

                            <InputFieldModal
                                label={"Nome Fantasia *"}
                                type={"text"}
                                id={"fantasiaforn"}
                                value={nomeFantasia}
                                onChangeModal={(e) => setNomeFantasia(e.target.value)}
                            />
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
                            />
                        </div>
                        <div className="col-sm-3 col-xl-5">
                            <InputFieldModal
                                label={"Endereço *"}
                                type={"text"}
                                id={"enderecoforn"}
                                value={endereco}
                                onChangeModal={(e) => setEndereco(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-2">

                            <InputFieldModal
                                label={"Nº *"}
                                type={"text"}
                                id={"numeroendforn"}
                                value={numero}
                                onChangeModal={(e) => setNumero(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <InputFieldModal
                                label={"Complemento"}
                                type={"text"}
                                id={"complementoendforn"}
                                value={complemento}
                                onChangeModal={(e) => setComplemento(e.target.value)}
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
                            />
                        </div>
                        <div className="col-sm-3 col-xl-4">
                            <InputFieldModal
                                label={"Cidade *"}
                                type={"text"}
                                id={"cidadeforn"}
                                value={cidade}
                                onChangeModal={(e) => setCidade(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-2">
                            <InputFieldModal
                                label={"UF *"}
                                type={"text"}
                                id={"ufforn"}
                                value={uf}
                                onChangeModal={(e) => setUf(e.target.value)}
                            />
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
                                value={email}
                                onChangeModal={(e) => setEmail(e.target.value)}
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
                            />

                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <InputFieldModal
                                label={"Telefone 2"}
                                type={"text"}
                                id={"tel2forn"}
                                value={telefone2}
                                onChangeModal={(e) => setTelefone2(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <InputFieldModal
                                label={"Telefone 3"}
                                type={"text"}
                                id={"tel3forn"}
                                value={telefone3}
                                onChangeModal={(e) => setTelefone3(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <label className="form-label" htmlFor="fornst">Situação *</label>
                            <Select
                                options={optionsSituacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={situacaoSelecionada}
                                onChange={(e) => setSituacaoSelecionada(e)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <h3 className="form-label" htmlFor="vrfat">* Configuração Padrão *</h3>
                </div>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xl-4">

                            <label htmlFor="">Fiscal</label>
                            <Select
                                options={optionsFiscal.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={fiscal}
                                onChange={(e) => setFiscal(e)}

                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <label htmlFor="">Enviar</label>
                            <Select
                                options={optionsEnviar.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={enviar}
                                onChange={(e) => setEnviar(e)}

                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <label>Condições de Pagamento</label>

                            <Select
                                options={
                                    dadosCondicoesPagamento.map((item) => {
                                        return {
                                            value: item.IDCONDICAOPAGAMENTO,
                                            label: item.DSCONDICAOPAG
                                        }
                                    })
                                }
                                value={condicaoPagamento}
                                onChange={(e) => setCondicaoPagamento(e)}

                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xl-3">
                            <label>Tipo Pedido</label>

                            <Select
                                options={optionsPedido.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={tipoPedido}
                                onChange={(e) => setTipoPedido(e)}

                            />
                        </div>
                        <div className="col-sm-4 col-xl-3">

                            <InputFieldModal
                                label={"Vendedor"}
                                type={"text"}
                                id={"novendedor"}
                                value={vendedor}
                                onChangeModal={(e) => setVendedor(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-6">

                            <InputFieldModal
                                label={"E-mail Vendedor"}
                                type={"text"}
                                id={"emailvendedor"}
                                value={emailVendedor}
                                onChangeModal={(e) => setEmailVendedor(e.target.value)}
                            />
                        </div>

                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-8 col-xl-8">
                            <label htmlFor="">Transportadora</label>
                            <Select
                                options={[
                                    { value: '', label: 'Selecione' },
                                    ...dadosTransportadora.map((item) => {
                                        return {
                                            value: item.IDTRANSPORTADORA,
                                            label: `${item.NUCNPJ} - ${item.NOFANTASIA}`
                                        }
                                    })
                                ]}
                                value={transportadora}
                                onChange={(e) => setTransportadora(e)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <label htmlFor="">Tipo Frete</label>
                            <Select
                                options={optionsFrete.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={tipoFrete}
                                onChange={(e) => setTipoFrete(e)}
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
                    onClickButtonCadastrar={handleCadastrar}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                />
            </form>
        </Fragment>
    )
}   