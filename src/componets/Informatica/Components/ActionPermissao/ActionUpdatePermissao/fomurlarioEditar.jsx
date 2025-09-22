import { Fragment } from "react"
import { InputField } from "../../../../Buttons/Input"
import { useEditarPerfilPermissaoUsuario } from "../hooks/useEditarPerfilPermissao"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useForm } from "react-hook-form"

export const FormularioEditar = ({ dadosEditarPermissao, handleClose, handleClick}) => {  
    const { register, handleSubmit, errors } = useForm();
    const {    
        alterar,
        setAlterar,
        criar,
        setCriar,
        nivel1,
        setNivel1,
        nivel2, 
        setNivel2,
        nivel3,
        setNivel3,
        nivel4,
        setNivel4,
        administrador,
        setAdministrador,
        usuarioLogado,
        submit,
        isSubmitting,
  } = useEditarPerfilPermissaoUsuario({dadosEditarPermissao, handleClose, handleClick})

    return (
        <Fragment>
            <form onSubmit={handleSubmit(submit)} >

                <div className="row">
                    <InputField 
                        label={"Administrador"}
                        type={"text"}
                        value={administrador}
                        onChange={(e) => setAdministrador(e.target.value)}

                    />
                    <InputField 
                        label={"Criar"}
                        type={"text"}
                        value={criar}
                        onChange={(e) => setCriar(e.target.value)}
                    />
                    <InputField 
                        label={"Alterar"}
                        type={"text"}
                        value={alterar}
                        onChange={(e) => setAlterar(e.target.value)}
                    />
                </div>
                <div className="row">
                    <InputField 
                        label={"Nivel 1"}
                        type={"text"}
                        value={nivel1}
                        onChange={(e) => setNivel1(e.target.value)}
                    />
                    <InputField 
                        label={"Nivel 2"}
                        type={"text"}
                        value={nivel2}
                        onChange={(e) => setNivel2(e.target.value)}
                    />
                    <InputField 
                        label={"Nivel 3"}
                        type={"text"}
                        value={nivel3}
                        onChange={(e) => setNivel3(e.target.value)}
                    />
                    <InputField 
                        label={"Nivel 4"}
                        type={"text"}
                        value={nivel4}
                        onChange={(e) => setNivel4(e.target.value)}
                    />
                </div>
                
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar="secondary"

                    ButtonTypeCadastrar={ButtonTypeModal}
                    textButtonCadastrar={isSubmitting ? "Salvando..." : "Salvar" }
                    onClickButtonCadastrar={handleSubmit(submit)}
                    corCadastrar="success"
                    disabled={isSubmitting}

                />
            </form>
        </Fragment>
    )
}