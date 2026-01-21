import React, { Fragment, useState } from 'react';
import Select from 'react-select';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';


export const FormularioCancelarVenda = ({ 
  handleClose,
  handleClick, 
  optionsModulos, 
  usuarioLogado 
}) => {
  const [motivo, setMotivo] = useState('');
  const [imprimir, setImprimir] = useState(false);


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