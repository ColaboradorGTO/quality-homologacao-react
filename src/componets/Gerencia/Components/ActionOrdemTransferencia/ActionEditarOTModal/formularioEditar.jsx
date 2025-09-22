import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FaRegSave } from "react-icons/fa"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useSalvarOT } from "../hooks/useSalvarOT"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm } from "react-hook-form"
import Select from "react-select"
import { ActionListaProdutos } from "./actionListaProdutos"
export const FormularioEditar = ({ handleClose, dadosDetalheTransferencia, handleClick }) => {
    const { register, handleSubmit, errors } = useForm();
    const {
        empresaOrigem,
        setEmpresaOrigem,
        empresaDestino,
        setEmpresaDestino,
        produto,
        setProduto,
        dadosProdutos,
        usuarioLogado,
        dadosEmpresa,
        onSubmit,
    } = useSalvarOT({handleClick});

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row" data-select2-id="736">
                    <div className="col-sm-6 col-xl-6">
                        <InputFieldModal
                            label={"Loja Origem"}
                            type="text"
                            readOnly={true}
                            value={usuarioLogado?.NOFANTASIA}
                            onChangeModal={(e) => setEmpresaOrigem(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" data-select2-id="735">
                       <label htmlFor=""> Loja Destino</label>
                        <Select
                            closeMenuOnSelect={false}
                            options={dadosEmpresa?.map((item) => ({
                                value: item.IDEMPRESA,
                                label: item.NOFANTASIA
                            }
                            ))}
                            value={dadosEmpresa?.find(option => option.value === empresaDestino)}
                            onChange={(e) => setEmpresaDestino(e.value)}
                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-6 col-xl-6">
                        <InputFieldModal
                            label={"Produto"}
                            type="text"
                            value={produto}
                            onChangeModal={(e) => setProduto(e.target.value)}
                        />
                    </div>
                </div>
 

                <div className="row mt-4">
                    <div className="col-sm-8 col-xl-8">

                        <ButtonTypeModal
                            Icon={FaRegSave}
                            textButton={"Salvar"}
                            cor={"info"}
                            className={"mr-4"}
                            onClickButtonType={onSubmit}

                        />
                    </div>
                    <div className="col-sm-8 col-xl-8 mt-4">
                        <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                    </div>
                </div>

                <ActionListaProdutos dadosProdutos={dadosProdutos} />
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar={"secondary"}
                />
            </form>
        </Fragment>
    )
}