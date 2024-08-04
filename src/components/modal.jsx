import React from 'react'

const Modal = props => {
    const { pokemonName, url, basic, regions, evo } = props.data  
    const handleRegions = () => {
        if (regions.length > 0 && regions[0] !== "") {
            console.log(regions) 
            const regionLi = regions.map(region => <li>{region}</li>)
            return (
                <div className="col-5 regBox">
                    <p className="text-center mx-0 mb-0 text-uppercase regionsModP">Regions: </p>                
                    <ul className="m-0 mt-1 regionsMod" > { regionLi }</ul >
                </div>
            )
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
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
      );
}
 
export default Modal;