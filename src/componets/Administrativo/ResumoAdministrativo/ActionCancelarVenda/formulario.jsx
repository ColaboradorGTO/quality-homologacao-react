import React, { Fragment, useState } from 'react';
import Select from 'react-select';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';
import { useQuery } from 'react-query';


export const FormularioCancelarVenda = ({ 
  handleClose,
  handleClick, 
  optionsModulos, 
  usuarioLogado 
}) => {
  const [motivo, setMotivo] = useState('');
  const [imprimir, setImprimir] = useState(false);

  const { data: dadosMotivoDevolucao = [], error: errorMotivoDevolucao, isLoading: isLoadingMotivoDevolucao, refetch: refetchMotivoDevolucao } = useQuery(
    'motivo-devolucao',
    async () => {
      const response = await get(`/motivo-devolucao`);
      return response.data;
    },
    { enabled: false, staleTime: 5 * 60 * 1000, }
  );

  return (
    <Fragment>
      <form>

    
        <FooterModal     
          
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Finalizar"}
          onClickButtonFechar
          corFechar="success"
        

          ButtonTypeCancelar={ButtonTypeModal}
          textButtonCancelar={"Fechar"}
          onClickButtonCancelar={handleClose}
          corCancelar="secondary"
        />
   
      </form>

    </Fragment>
  );
};