import React, { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { ButtonType } from "../../../Buttons/ButtonType"
import { ActionListaCampanha } from "./actionListaCampanha"
import { MdAdd } from "react-icons/md"
import { get } from "../../../../api/funcRequest"
import { useQuery } from "react-query"
import { ActionCadastrarCampanhaModal } from "./ActionCadastrarCampanha/actionCadastrarCampanhaModal"

export const ActionPesquisaCampanha = () => {
  const [modalCadastrarCampanha, setModalCadastrarCampanha] = useState(false)


  const { data: dadosListaCampanha = [], error: errorPromocao, isLoading: isLoadingPromocao, refetch: refetchPromocao } = useQuery(
    'campanha',
    async () => {
      const response = await get(`/campanha`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Cadastro de Campanhas"]}
        title="Cadsatro de Campanhas"

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={(e) => setModalCadastrarCampanha(true)}
        linkNome={"Cadastrar Campanha"}
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />

      <ActionListaCampanha dadosListaCampanha={dadosListaCampanha} />

      <ActionCadastrarCampanhaModal 
        show={modalCadastrarCampanha} 
        handleClose={(e) => setModalCadastrarCampanha(false)} 
        refetchPromocao={refetchPromocao} 
      />
    </Fragment >
  )
}