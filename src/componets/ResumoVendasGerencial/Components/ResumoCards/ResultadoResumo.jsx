import React, { Fragment } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsGem, BsGlobe } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";


export const ResultadoResumo = ({
  cardVendas,
  valorVendas,
  nomeVendas,
  IconVendas,
  textoMesVendas,
  valorVendasAnterior,
  textoMesVendasAnterior,
  porcentoVendas,

  cardTotal,
  valorTotal,
  IconTotal,
  textoMesTotal,
  valorTotalAnterior,
  textoMesTotalAnterior,
  porcentoTotal,

  cardDinheiro,
  valorDinheiro,
  IconDinheiro,
  textoMesDinheiro,
  valorDinheiroAnterior,
  textoMesDinheiroAnterior,
  porcentoDinheiro,

  cardCartao,
  valorCartao,
  IconCartao,
  textoMesCartao,
  valorCartaoAnterior,
  textoMesCartaoAnterior,
  porcentoCartao,

  cardPos,
  valorPos,
  IconPos,
  textoMesPos,
  valorPosAnterior,
  textoMesPosAnterior,
  porcentoPos,

  cardConvenio,
  valorConvenio,
  IconConvenio,
  textoMesConvenio,
  valorConvenioAnterior,
  textoMesConvenioAnterior,
  porcentoConvenio,

  cardFatura,
  valorFatura,
  IconFatura,
  textoMesFatura,
  valorFaturaAnterior,
  textoMesFaturaAnterior,
  porcentoFatura,

  cardCredsystem,
  valorCredsystem,
  IconCredsystem,
  textoMesCredsystem,
  valorCredsystemAnterior,  
  textoMesCredsystemAnterior,
  porcentoCredsystem,

  


  iconSize,
  iconColor
}) => {


  return (
    <Fragment>
      <div className="row">
      


        <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6" >
          {cardVendas && (
            <div 
              className=" bg-info-300 rounded overflow-hidden position-relative text-white mb-g" 
              style={{padding: '5px 10px 10px 10px', width: '100%'}}
            >
              <div className="">
                <div style={{justifyContent: 'space-between', display: 'flex'}}>

                  <h3 className="fw-500 m-0"> {textoMesVendas} </h3>
                  <h4 style={{ margin: '0px'}}> {porcentoVendas} </h4>
                </div>
                <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                  {valorVendas}
                </h2>
              

              </div>
              <div className="">
                <h2 style={{margin: '0px'}} >
                  <small className="position-relative  h5 text-warning"> {valorVendasAnterior}</small>
                </h2>
                <small className="position-absolute pos-right pos-top"> {textoMesVendasAnterior} </small>
              </div>
              {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
              {IconVendas &&
                <IconVendas
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}
                  color={iconColor}
                />
              }
            </div>

          )}
        </div>

          <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6">
            {cardTotal && (
              <div 
                className=" bg-info-300 rounded overflow-hidden position-relative text-white mb-g" 
                style={{padding: '5px 10px 10px 10px', width: '100%'}}
              >
                <div className="">
                  <div style={{justifyContent: 'space-between', display: 'flex'}}>

                    <h3 className="fw-500 m-0"> {textoMesTotal} </h3>
                    <h4 style={{ margin: '0px'}}> {porcentoTotal} </h4>
                  </div>
                  <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                    {valorTotal}
                  </h2>
                

                </div>
                <div className="">
                  <h2 style={{margin: '0px'}} >
                    <small className="position-relative  h5 text-warning"> {valorTotalAnterior}</small>
                  </h2>
                  <small className="position-absolute pos-right pos-top"> {textoMesTotalAnterior} </small>
                </div>
                {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
                {IconTotal &&
                  <IconTotal
                    className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                    size={iconSize}
                    color={iconColor}
                  />
                }
              </div>
            )}
          </div>

          <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6">
            {cardPos && (
              <div 
                className=" bg-warning-600 rounded overflow-hidden position-relative text-white mb-g" 
                style={{padding: '5px 10px 10px 10px', width: '100%'}}
              >
                <div className="">
                  <div style={{justifyContent: 'space-between', display: 'flex'}}>

                    <h3 className="fw-500 m-0"> {textoMesPos} </h3>
                    <h4 style={{ margin: '0px'}}> {porcentoPos} </h4>
                  </div>
                  <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                    {valorPos}
                  </h2>
                

                </div>
                <div className="">
                  <h2 style={{margin: '0px'}} >
                    <small className="position-relative  h5 "> {valorPosAnterior}</small>
                  </h2>
                  <small className="position-absolute pos-right pos-top"> {textoMesPosAnterior} </small>
                </div>
                {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
                {IconPos &&
                  <IconPos
                    className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                    size={iconSize}
                    color={iconColor}
                  />
                }
              </div>
            )}
          </div>

          <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6" >
            {cardCartao && (
              <div 
                className="bg-warning-600 rounded overflow-hidden position-relative text-white mb-g" 
                style={{padding: '5px 10px 10px 10px', width: '100%'}}
              >
                <div className="">
                  <div style={{justifyContent: 'space-between', display: 'flex'}}>

                    <h3 className="fw-500 m-0"> {textoMesCartao} </h3>
                    <h4 style={{margin: '0px'}}> {porcentoCartao} </h4>
                  </div>
                  <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                    {valorCartao}
                  </h2>
                

                </div>
                <div className="">
                  <h2 style={{margin: '0px'}} >
                    <small className="position-relative  h5 "> {valorCartaoAnterior}</small>
                  </h2>
                  <small className="position-absolute pos-right pos-top"> {textoMesCartaoAnterior} </small>
                </div>
                {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
                {IconCartao &&
                  <IconCartao
                    className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                    size={iconSize}
                    color={iconColor}
                  />
                }
              </div>
            )}
          </div>

        <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6" >
          {cardDinheiro && (
            <div 
              className=" bg-success-500 rounded overflow-hidden position-relative text-white mb-g" 
              style={{padding: '5px 10px 10px 10px', width: '100%'}}
            >
              <div className="">
                <div style={{justifyContent: 'space-between', display: 'flex'}}>

                  <h3 className="fw-500 m-0"> {textoMesDinheiro} </h3>
                  <h4 style={{ margin: '0px'}}> {porcentoDinheiro} </h4>
                </div>
                <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                  {valorDinheiro}
                </h2>
              

              </div>
              <div className="">
                <h2 style={{margin: '0px'}} >
                  <small className="position-relative  h5 "> {valorDinheiroAnterior}</small>
                </h2>
                <small className="position-absolute pos-right pos-top"> {textoMesDinheiroAnterior} </small>
              </div>
              {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
              {IconDinheiro &&
                <IconVendas
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}
                  color={iconColor}
                />
              }
            </div>

          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6" >
          {cardConvenio && (
            <div 
              className=" bg-success-500 rounded overflow-hidden position-relative text-white mb-g" 
              style={{padding: '5px 10px 10px 10px', width: '100%'}}
            >
              <div className="">
                <div style={{justifyContent: 'space-between', display: 'flex'}}>

                  <h3 className="fw-500 m-0"> {textoMesConvenio} </h3>
                  <h4 style={{ margin: '0px'}}> {porcentoConvenio} </h4>
                </div>
                <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                  {valorConvenio}
                </h2>
              

              </div>
              <div className="">
                <h2 style={{margin: '0px'}} >
                  <small className="position-relative  h5 "> {valorConvenioAnterior}</small>
                </h2>
                <small className="position-absolute pos-right pos-top"> {textoMesConvenioAnterior} </small>
              </div>
              {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
              {IconConvenio &&
                <IconConvenio
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}
                  color={iconColor}
                />
              }
            </div>
          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6" >
          {cardFatura && (
            <div 
              className=" bg-primary-500 rounded overflow-hidden position-relative text-white mb-g" 
              style={{padding: '5px 10px 10px 10px', width: '100%'}}
            >
              <div className="">
                <div style={{justifyContent: 'space-between', display: 'flex'}}>

                  <h3 className="fw-500 m-0"> {textoMesFatura} </h3>
                  <h4 style={{ margin: '0px'}}> {porcentoFatura} </h4>
                </div>
                <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                  {valorFatura}
                </h2>
              

              </div>
              <div className="">
                <h2 style={{margin: '0px'}} >
                  <small className="position-relative  h5 "> {valorFaturaAnterior}</small>
                </h2>
                <small className="position-absolute pos-right pos-top"> {textoMesFaturaAnterior} </small>
              </div>
              {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
              {IconFatura &&
                <IconFatura
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}
                  color={iconColor}
                />
              }
            </div>
          )}
        </div>


        <div className="col-sm-6 col-lg-4 col-xl-6 col-xl-6" >
          {cardCredsystem && (
            <div 
              className=" bg-primary-500 rounded overflow-hidden position-relative text-white mb-g" 
              style={{padding: '5px 10px 10px 10px', width: '100%'}}
            >
              <div className="">
                <div style={{justifyContent: 'space-between', display: 'flex'}}>

                  <h3 className="fw-500 m-0"> {textoMesCredsystem} </h3>
                  <h4 style={{ margin: '0px'}}> {porcentoCredsystem} </h4>
                </div>
                <h2 className="display-3 d-inline-block l-h-n m-0 fw-500 m-0">
                  {valorCredsystem}
                </h2>
              

              </div>
              <div className="">
                <h2 style={{margin: '0px'}} >
                  <small className="position-relative  h5 "> {valorCredsystemAnterior}</small>
                </h2>
                <small className="position-absolute pos-right pos-top"> {textoMesCredsystemAnterior} </small>
              </div>
              {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
              {IconCredsystem &&
                <IconCredsystem
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}
                  color={iconColor}
                />
              }
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}