import React from 'react'
import $ from 'jquery'

const Modal = props => {
    const { pokemonName, url, basic, regions, evo, fullDesc } = props.data  
    const handleRegions = () => {
        if (regions.length > 0 && regions[0] !== "") {
            //console.log(regions) 
            const regionLi = regions.map(region => <li>{region}</li>)
            return (
                <div className="col-5 regBox">
                    <p className="text-center mx-0 mb-0 text-uppercase regionsModP">Regions: </p>                
                    <ul className="m-0 mt-1 regionsMod" > { regionLi }</ul >
                </div>
            )
        }
        
    }
    const handleFigure = () => {
        const evoName = evo.evo
        const evoUrl = evo.ids
        let evolutions = []
        // list all evolutions with their image if they have evolutions
        if (evoName.length === evoUrl.length) {
            evolutions.push(
                <p key={pokemonName + 'evo'} className="col-12 text-center evolution"><b>Evolutions: </b></p>
            )
            for (let i = 0; i < evoName.length; i++) {
                evolutions.push(
                    <figure key={evoName[i]} className="col-3" role="button" onClick={() => handleClick(evoName[i])}>
                        <img src={evoUrl[i]} alt={evoName[i] + ' Image'} />
                        <figcaption className="figs">{ evoName[i] }</figcaption>
                    </figure>
                )
                if (i < evoName.length - 1) {
                    const colName = evoName.length === 2 ? 'col-2' : 'col'
                    evolutions.push(
                        <span key={evoName[i] + 'Span'} className={colName + " text-center bubble"}>
                            <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </span>
                    )
                }
            }
        }
        else {
            evolutions.push(
                <h2 className="text-center evolution">Does Not Evolve</h2>
            )
        }
        return evolutions
    }  
    const handleClick = current => {
        const prev = "#" + pokemonName.toLowerCase() + "Modal"
        const next = "#" + current + "Modal"
        if (prev !== next) {
            $(prev).modal('hide')
            $('.modal').css('overflow-y', 'auto');
            $(next).modal('show')
        }
    }
    return (        
        <div className="modal fade" id={pokemonName + "Modal"} tabIndex="-1" role="dialog" aria-labelledby={pokemonName + "ModalLabel"} aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content textureBg">
                    <div className="modal-header">
                        <div className="col-10">
                            <div className="row intro">
                                <div className="col-7 align-content-center">
                                    <h1 className="modalName">{pokemonName}</h1>
                                </div>                                
                                {handleRegions()}
                            </div>
                        </div>
                        <div className="col">
                            <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>                        
                    </div>
                    <div className="modal-body row mb-2">
                        <div className="col-12">
                            <section className="row py-2 descMod">
                                <article className="col-12 text-center arsenal typeMod">
                                    <b>TYPE: {basic.jointType}</b>
                                </article>
                                <article className="col-12">
                                    {fullDesc}
                                </article>
                            </section>
                        </div>
                        <div className="col-12 descMod noTop">
                            <article className="row my-2">
                                <p className="col-6"><b>Imperial Height: </b>{basic.imperialHt}</p>
                                <p className="col-6"><b>Imperial Weight: </b>{basic.imperialWt}</p>
                                <p className="col-6"><b>Metric Height: </b>{basic.metricHt}</p>
                                <p className="col-6"><b>Metric Weight: </b>{basic.metricWt}</p>
                            </article>
                            <article className="row">
                                <p className="col-12">
                                    <b>Possible Moves: </b>{basic.jointMoves}
                                </p>
                            </article>
                        </div>
                        <div className="col-12 mt-2">
                            <div className="row">                                    
                                <div className="col-12">
                                    <figure className="w-100 text-center cardFig">
                                        <img src={url} alt={pokemonName + " Image"} className="imgMod" />
                                    </figure>
                                </div>
                            </div>
                            <div className="row justify-content-around align-items-center">
                                {handleFigure()}
                            </div>
                        </div>
                        
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
      );
}
 
export default Modal;