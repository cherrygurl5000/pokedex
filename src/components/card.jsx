import React from 'react'

const Card = props => {
    const { pokemonName, url, basic, regions, evo } = props.data   
    function handleRegion() {
        if (regions.length > 0 && regions[0] !== "")
            return (
                <p className="row types">
                    <b className='mr-2'>Regions: </b>
                    <span className="arsenal">{regions.join(", ")}</span>
                </p>
            )
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
                    <figure key={evoName[i]} className="col-3">
                        <img src={evoUrl[i]} alt={evoName[i] + ' Image'} />
                        <figcaption className="figs">{ evoName[i] }</figcaption>
                    </figure>
                )
                if (i < evoName.length - 1) {
                    evolutions.push(
                        <span key={evoName[i] + 'Span'} className="col text-center bubble">
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
    function backgroundImg() {
        let type = basic.jointType
        type = type.split('-')
        type = type[0].toLowerCase()

        return type
    }
        
    return ( 
        <>
            <div className={"col-3 border cards m-2 " + backgroundImg()}>
                <div className="row mt-2">
                    <h1 className="text-center evolution noBg"><u>{pokemonName}</u></h1>
                </div>
                <div className="row">
                    <figure className="col-5 cardFig">
                        <img src={url} alt={pokemonName + " Image"} />
                    </figure>
                    <div className="col-7 align-content-center">
                        <p className="row types">
                            <b className='mr-2'>Type: </b>
                            <span className="arsenal">{basic.jointType}</span>                            
                        </p>
                        {handleRegion()}
                    </div>
                </div>
                <div className="row justify-content-around align-items-center">
                    {handleFigure()}
                </div>
            </div>
            
        </>
    );
    
}
 
export default Card;