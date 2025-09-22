// import { Fragment, useEffect, useState } from "react"
// import { Modal } from "react-bootstrap"
// import { InputFieldModal } from "../../../Buttons/InputFieldModal"
// import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
// import { FooterModal } from "../../../Modais/FooterModal/footerModal"
// import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
// import { get, post } from "../../../../api/funcRequest"
// import { useForm } from "react-hook-form";
// import Swal from 'sweetalert2';
// import Select from 'react-select';

// export const ActionVincularFabricanteFornecedorModal = ({ show, handleClose, dadosDetalheFornecedorFabricante }) => {
//   const { register, handleSubmit, errors } = useForm();
//   const [statusSelecionado, setStatusSelecionado] = useState("")
//   const [fornecedorSelecionado, setFornecedorSelecionado] = useState("")
//   const [dadosFabricantes, setDadosFabricantes] = useState([])
//   const [nomeFabricante, setNomeFabricante] = useState("")
//   const [dafaultValueFabricante, setDefaultValueFabricante] = useState(null)
//   useEffect(() => {
  
//     getListaFabricantes()
//     if (dadosDetalheFornecedorFabricante.length > 0) {
//       setDefaultValueFabricante(dadosDetalheFornecedorFabricante[0].DSFABRICANTE);
//     }
//   }, [dadosDetalheFornecedorFabricante])

//   const getListaFabricantes = async () => {
//     try {
//       const response = await get('/fabricantes');
//       setDadosFabricantes(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const handleChangeFornecedor = (e) => {
//     setFornecedorSelecionado(e.value)
//   }

//   const handleChangeStatus = (e) => {
//     setStatusSelecionado(e.value)
//   }

//   const onSubmit = async (data) => {
//     const postData = {
//       IDEMPRESA: usuarioLogado.IDEMPRESA,
//       IDUSUARIO: usuarioLogado.id,
//       DTDESPESA: dtDespesa,
//       IDCATEGORIARECDESP: categoriaRecDesp,
//       DSHISTORIO: dsHistorio,
//       DSPAGOA: dsPagoA,
//       TPNOTA: tpNota,
//       NUNOTAFISCAL: nuNotaFiscal,
//       VRDESPESA: vrDespesa,
  
//     }

   
//     const response = await post('/cadastrarDespesaLoja', postData)
//     .then(response => {
      
//       // Limpar os campos do formulário
     
//       console.log(response, 'despesa cadastrada com sucesso front end!')
//     })


//     Swal.fire({
//       position: 'top-end',
//       icon: 'success',
//       title: 'Cadastrado com sucesso!',
//       showConfirmButton: false,
//       timer: 15000
//     })

//     .catch (error => {

//       Swal.fire({
//         position: 'top-end',
//         icon: 'error',
//         title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
//         showConfirmButton: false,
//         timer: 15000 
//       });
//       console.log(error)
//     })
      
//   }

//   const optionsStatus = [
//     { value: "True", label: "Ativo" },
//     { value: "False", label: "Inativo" },
//   ]

  
//   return (

//     <Fragment>

//       <Modal
//         show={show}
//         onHide={handleClose}
//         class="modal-content"
//         size="lg"
//         centered
//       >

//         <HeaderModal
//           title={"Vínculo Fabricante / Fornecedor"}
//           subTitle={"Inclusão e Alteração"}
//           handleClose={handleClose}
//         />


//         <Modal.Body>
//           <form> 
//           <div className="form-group">
//             <div className="row">

//               <div className="col-sm-6 col-xl-4">

//                 <InputFieldModal
//                   label={"Fornecedor *"}
//                   type={"text"}
//                   nome={"nomeFabricante"}
//                   readOnly={true}
//                   value={dadosDetalheFornecedorFabricante[0]?.DSFORNECEDOR}
//                   onChange={(e) => setNomeFabricante(e.target.value)}
//                   required={true}
//                   minLength={10}
//                   register={register}
//                   // aria-invalid={errors.nomeFabricante ? "true" : "false"}
//                   // errors={errors.nomeFabricante && errors.nomeFabricante.message}
//                 />
//                 {/* {errors.nofabricantevinc && <span className="text-danger">Campo obrigatório</span>} */}
//               </div>
//               <div className="col-sm-6 col-xl-6">
//                 <label htmlFor="fornecedor">Nome Fabricante *</label>
//                 <Select
//                 className="basic-single"
//                 classNamePrefix="select"
//                 defaultValue={dafaultValueFabricante}
//                   // value={fornecedorSelecionado}
//                   options={dadosFabricantes.map((item) => {
//                     return {
//                       value: item.IDFORNECEDOR,
//                       label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
//                     }
//                   })}
//                   onChange={handleChangeFornecedor}
//                 />
//                 {/* {errors.fornecedor && <p role="alert">{errors.fornecedor.message}</p>} */}

//               </div>
//               <div className="col-sm-6 col-xl-2">
//                 <label htmlFor="situacao">Situação *</label>
//                 <Select
//                   defaultValue={statusSelecionado}
//                   options={optionsStatus.map((item) => {
//                     return {
//                       value: item.value,
//                       label: item.label
//                     }
//                   })}
//                   onChange={handleChangeStatus}
//                   />
//                   {/* {errors.situacao && <p role="alert">{errors.situacao.message}</p>} */}
//               </div>
//             </div>
//           </div>

//           </form>
         
//           <FooterModal
//             ButtonTypeFechar={ButtonTypeModal}
//             onClickButtonFechar={handleClose}
//             textButtonFechar={"Fechar"}
//             corFechar={"secondary"}

//             ButtonTypeCadastrar={ButtonTypeModal}
//             onClickButtonCadastrar={handleSubmit(onSubmit)}
//             textButtonCadastrar={"Salvar"}
//             corCadastrar={"success"}
//           />
//         </Modal.Body>
//       </Modal>

//     </Fragment>
//   )
// }

