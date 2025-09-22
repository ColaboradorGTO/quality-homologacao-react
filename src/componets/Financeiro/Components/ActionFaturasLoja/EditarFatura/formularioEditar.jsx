import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm } from "react-hook-form"
import Select from 'react-select'
import { useEditarFatura } from "../hooks/useEditarFatura"

export const FormularioEditarFatura = ({ dadosDetalheFaturaCaixa, handleClose, optionsModulos }) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    valorFatura,
    caixa,
    empresaSelecionada,
    codAutorizacao,
    codPix,
    statusSelecionado,
    stPixSelecionado,
    OptionsStatus,
    OptionsPIX,
    onSubmit,
    setCodAutorizacao,
    setCodPix,
    setStatusSelecionado,
    setStPixSelecionado,
    setValorFatura,
    setEmpresaSelecionada,
    setCaixa
  } = useEditarFatura({ dadosDetalheFaturaCaixa, optionsModulos });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div class="form-group">
        <div class="row">

          <div class="col-sm-6 col-xl-6">
            <InputFieldModal
              className="form-control input"
              readOnly={true}
              label="Empresa"
              value={empresaSelecionada}
            />

          </div>
          <div class="col-sm-6 col-xl-6">
            <InputFieldModal
              className="form-control input"
              readOnly={true}
              label="Caixa - Código Autorização da Fatura"
              value={caixa}
            />

          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="row">


          <div class="col-sm-6 col-xl-3">

            <InputFieldModal
              type="text"
              className="form-control input"

              label="Código Autorização"
              value={codAutorizacao}
              onChangeModal={(e) => setCodAutorizacao(e.target.value)}
            />
          </div>
          <div class="col-sm-6 col-xl-4">
            <InputFieldModal
              type="text"
              className="form-control input"

              label="Código PIX"
              value={codPix}
              onChangeModal={(e) => setCodPix(e.target.value)}
            />
          </div>


          <div class="col-sm-6 col-xl-2">
            <label htmlFor="">PIX</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={stPixSelecionado}
              options={OptionsPIX}
              setStPixSelecionado={(e) => setStPixSelecionado(e.value)}
            />

          </div>
          <div class="col-sm-6 col-xl-3">
            <label htmlFor="">Status</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={statusSelecionado}
              options={OptionsStatus}
              onChange={(e) => setStatusSelecionado(e.value)}
            />

          </div>
        </div>
      </div>

      <div class="form-group">
        <div className="row">

          <div class="col-sm-6">
            <InputFieldModal
              id="VrValorDespesa"
              type="text"
              className="form-control input"
              value={valorFatura}
              onChangeModal={(e) => setValorFatura(e.target.value)}
              label="Valor da Fatura"
              placeholder="R$ 0,00"
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
        onClickButtonCadastrar={onSubmit}
        textButtonCadastrar={"Confimar Alteração"}
        corCadastrar={"success"}
      />
    </form>
  )
}