import React, { Fragment, useState } from 'react';
import Select from 'react-select';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';
import { useQuery } from 'react-query';
import { get } from '../../../../api/funcRequest';


export const FormularioCancelarVenda = ({ 
  handleClose,
  handleClick, 
  optionsModulos, 
  usuarioLogado,
  dadosAtivasVendas 
}) => {
  const [motivo, setMotivo] = useState('');
  const [imprimir, setImprimir] = useState(false);

  const { data: dadosMotivoDevolucao = [], error: errorMotivoDevolucao, isLoading: isLoadingMotivoDevolucao, refetch: refetchMotivoDevolucao } = useQuery(
    'lista-motivo-devolucao',
    async () => {
      const response = await get(`/lista-motivo-devolucao`);
      return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, }
  );

  return (
    <Fragment>
      <form>
        <div className='form-group'>
          <div className="col-sm-6 col-md-3 col-xl-6">

            <label htmlFor='Cancelar'>Motivo do Cancelamento:</label>
            <Select
              options={dadosMotivoDevolucao
                ?.filter((item) => item.STATIVO == 'True')
                .map((item) => ({
                  value: item.DSMOTIVO,
                  label: item.DSMOTIVO
                })) || []
              }
              value={motivo}
              onChange={(e) => setMotivo(e.value)}
            />
          </div>
        </div>
    
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