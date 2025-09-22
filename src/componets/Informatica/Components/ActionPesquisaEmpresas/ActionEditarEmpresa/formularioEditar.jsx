import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useEditarEmpresa } from "../hooks/useEditarEmpresa"
import { useForm } from "react-hook-form"
import { dataFormatada } from "../../../../../utils/dataFormatada"
import Select from 'react-select';


export const FormularioEditar = ({ handleClose, dadosEditarEmpresa }) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    grupoEmpresa,
    setGrupoEmpresa,
    situacao,
    setSituacao,
    dataCriacao,
    setDataCriacao,
    nomeFantasia,
    setNomeFantasia,
    cep,
    setCep,
    endereco,
    setEndereco,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    cidade,
    setCidade,
    uf,
    setUF,
    email,
    setEmail,
    telefone,
    setTelefone,
    onSubmit
  } = useEditarEmpresa({dadosEditarEmpresa})

const options = [ 
    {
        value: "True",
        label: "Ativo"
    },
    {
        value: "False",
        label: "Inativo"
    }
]


  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} >

        <div className="form-group">
          <input type="hidden" header="IDEmpresaAtualizar" id="IDEmpresaAtualizar" value="" />
          <div className="row">
            <div className="col-sm-4 col-xl-4">
              <InputFieldModal
                label={"Grupo Empresarial"}
                type="text"
                readOnly={true}
                value={grupoEmpresa}
              />
            </div>
            <div className="col-sm-4 col-xl-4">

               <label>
                    Situação:
                </label>
                <Select
                    options={options}
                    value={options.find(option => option.value === situacao)}
                    onChange={(e) => setSituacao(e.value)}
                    
                />
            </div>
            <div className="col-sm-4 col-xl-4">

              <InputFieldModal
                label={"Data Criação"}
                type="datetime"
                readOnly={true}
                value={dataFormatada(dataCriacao)}
              />
            </div>
          </div>


          <div className="row mt-3">
            <div className="col-sm-12 col-xl-12">
              <InputFieldModal
                label={"Nome Fantasia"}
                type="text"
                readOnly={true}
                value={nomeFantasia}
              />
            </div>
          </div>


          <div className="form-group">
            <div className="row">
              <div className="mt-3" style={{ display: 'flex' }}>
                <div className="col-sm-4 col-xl-4">
                  <InputFieldModal
                    label={"CEP"}
                    type="text"
               
                    value={cep}
                  />
                </div>
                <div className="col-sm-4 col-xl-4">

                  <InputFieldModal
                    label={"Endereço"}
                    type="text"
       
                    value={endereco}
                  />
                </div>
                <div className="col-sm-4 col-xl-4">
                  <InputFieldModal
                    label={"Complemento"}
                    type="text"
              
                    value={complemento}
                  />
                </div>

              </div>


            </div>
            <div className="row">
              <div className="mt-3" style={{ display: 'flex' }}>

                <div className="col-sm-4 col-xl-4">

                  <InputFieldModal
                    label={"Bairro"}
                    type="text"
         
                    value={bairro}

                  />
                </div>
                <div className="col-sm-4 col-xl-4">
                  <InputFieldModal
                    label={"Cidade"}
                    type="text"
                
                    value={cidade}

                  />
                </div>
                <div className="col-sm-4 col-xl-4">
                  <InputFieldModal
                    label={"Estado"}
                    type="text"
        
                    value={uf}

                  />
                </div>
              </div>

            </div>
            <div className="row">
              <div className="mt-3" style={{ display: 'flex' }}>

                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"E-mail"}
                    type="email"
                    value={email}
                    readOnly={true}
                    onChangeModal={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Telefone"}
                    type="text"
                    value={telefone}
                    onChangeModal={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={onSubmit}
          textButtonCadastrar={"Atualizar"}
          corCadastrar="success"

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />

      </form>
    </Fragment>
  )
}