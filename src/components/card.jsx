import React, { Component } from 'react'

const Card = props => {
    console.log(props)
    const { pokemonName, url, basic, regions } = props.data   
    function region() {
        if (regions.length > 0 && regions[0] !== "")
            return <p className="row"><b className='mr-2'>Regions: </b>{regions.join(", ")}</p>
    }
    return ( 
        // <h1>{pokemonName}</h1>
        <>
            <div className="col-3 border m-2">
                <div className="row">
                    <h1 className='w-100 text-center'>{pokemonName}</h1>
                </div>
                <div className="row">
                    <figure className="col-5 cardFig">
                        <img src={url} alt={pokemonName + " Image"} />
                    </figure>
                    <div className="col-7 align-content-center">
                        <p className="row"><b className='mr-2'>Type: </b>{basic.jointType }</p>
                        {region()}
                    </div>
                </div>
            </div>
            
        </>
    );
    
}
 
export default Card;