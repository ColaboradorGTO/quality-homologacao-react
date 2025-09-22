import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"

export const FormularioEditar = ({ handleClose, dadosDetalheTranspotador }) => {
    return (
        <Fragment>
            <form>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xl-4">

                            <InputFieldModal
                                label={"CNPJ *"}
                                type={"text"}
                                id={"cnpjFornecedor"}
                                placeholder={"00.000.000/0000-00"}
                                value={dadosDetalheTranspotador[0]?.NUCNPJ}
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
                                value={dadosDetalheTranspotador[0]?.NUINSCESTADUAL}
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
                                value={dadosDetalheTranspotador[0]?.NUINSCMUNICIPAL}
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
                                value={dadosDetalheTranspotador[0]?.NORAZAOSOCIAL}
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
                                value={dadosDetalheTranspotador[0]?.NOFANTASIA}
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
                                value={dadosDetalheTranspotador[0]?.NUCEP}
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
                                value={dadosDetalheTranspotador[0]?.EENDERECO}
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
                                value={dadosDetalheTranspotador[0]?.ENUMERO}
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
                                value={dadosDetalheTranspotador[0]?.ECOMPLEMENTO}
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
                                value={dadosDetalheTranspotador[0]?.EBAIRRO}
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
                                value={dadosDetalheTranspotador[0]?.ECIDADE}
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
                                value={dadosDetalheTranspotador[0]?.SGUF}
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
                                value={dadosDetalheTranspotador[0]?.NUIBGE}
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
                                value={dadosDetalheTranspotador[0]?.NOREPRESENTANTE}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"E-mail"}
                                type={"text"}
                                id={"emailforn"}
                                value={dadosDetalheTranspotador[0]?.EEMAIL}
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
                                value={dadosDetalheTranspotador[0]?.NUTELEFONE1}
                            />

                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <InputFieldModal
                                label={"Telefone 2"}
                                type={"text"}
                                id={"tel2forn"}
                                value={dadosDetalheTranspotador[0]?.NUTELEFONE2}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <InputFieldModal
                                label={"Telefone 3"}
                                type={"text"}
                                id={"tel3forn"}
                                value={dadosDetalheTranspotador[0]?.NUTELEFONE3}
                            />
                        </div>

                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação</label>
                            <Select
                                options={optionsStatus.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={statusSelecionado}
                                onChange={(e) => setStatusSelecionado(e)}
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
        </Fragment>
    )
}