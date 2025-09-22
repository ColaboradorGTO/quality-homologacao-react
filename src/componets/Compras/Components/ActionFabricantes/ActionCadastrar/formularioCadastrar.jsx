import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';

export const FormularioCadastrar = ({ handleClose }) => {
    return (
        <Fragment>
            <form>
                <div className="row">
                    <div className="col-sm-6 col-xl-3">
                        <InputFieldModal
                            label={"Nome Fabricante *"}
                            type={"text"}
                            id={"nofabricante"}
                            value={fabricante}
                            onChangeModal={(e) => setFabricante(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <label>Situação *</label>
                        <Select
                            id={"stativofab"}
                            readOnly={false}
                            options={options.map((item) => {
                                return {
                                    value: item.value,
                                    label: item.label
                                }
                            })}
                            value={statusSelecionado}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group mt-5">

                    <h5 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h5>
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